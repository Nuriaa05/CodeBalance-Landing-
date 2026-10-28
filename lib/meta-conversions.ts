import { isIP } from "node:net";
import type { MetaConversionEvent } from "./meta-pixel.ts";

const MAX_BODY_BYTES = 8 * 1024;
const EVENT_NAMES = new Set(["PageView", "Contact", "Lead"]);
const CONTACT_METADATA_KEYS = new Set([
  "content_category",
  "content_name",
  "contact_method",
  "event_location",
  "service_name",
  "lead_type",
]);
const ATTRIBUTION_COOKIE_PATTERN = /^fb\.\d+\.\d{10,16}\.[A-Za-z0-9_.-]{1,500}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function parseEvent(value: unknown, origin: string, now: number): MetaConversionEvent | null {
  if (
    !isRecord(value) ||
    typeof value.event_name !== "string" || !EVENT_NAMES.has(value.event_name) ||
    typeof value.event_id !== "string" || !/^[A-Za-z0-9_-]{1,100}$/.test(value.event_id) ||
    typeof value.event_time !== "number" || !Number.isInteger(value.event_time) ||
    value.event_time < now - 7 * 24 * 60 * 60 || value.event_time > now + 60 ||
    typeof value.event_source_url !== "string" || value.event_source_url.length > 2048 ||
    !isRecord(value.custom_data)
  ) return null;

  let sourceUrl: URL;
  try {
    sourceUrl = new URL(value.event_source_url);
  } catch {
    return null;
  }

  if (sourceUrl.origin !== origin || sourceUrl.username || sourceUrl.password) return null;

  const customData: MetaConversionEvent["custom_data"] = {};
  for (const [key, entry] of Object.entries(value.custom_data)) {
    if (!CONTACT_METADATA_KEYS.has(key)) continue;
    if (
      (typeof entry === "string" && entry.length <= 200) ||
      (typeof entry === "number" && Number.isFinite(entry)) ||
      typeof entry === "boolean"
    ) {
      customData[key] = entry;
    } else {
      return null;
    }
  }

  return {
    event_name: value.event_name as MetaConversionEvent["event_name"],
    event_id: value.event_id,
    event_time: value.event_time,
    event_source_url: `${sourceUrl.origin}${sourceUrl.pathname}`,
    custom_data: customData,
  };
}

function readAttributionCookie(request: Request, name: string) {
  const cookie = request.headers.get("cookie")?.split(";")
    .map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  const value = cookie?.slice(name.length + 1);
  return value && ATTRIBUTION_COOKIE_PATTERN.test(value) ? value : undefined;
}

function getUserData(request: Request, landingFbc: unknown) {
  const userData: Record<string, string> = {};
  const ip = (request.headers.get("x-vercel-forwarded-for") ?? request.headers.get("x-forwarded-for"))
    ?.split(",")[0]?.trim();
  const userAgent = request.headers.get("user-agent");
  const fbp = readAttributionCookie(request, "_fbp");
  let fbc = readAttributionCookie(request, "_fbc");
  if (typeof landingFbc === "string" && ATTRIBUTION_COOKIE_PATTERN.test(landingFbc)) {
    const landingClickId = landingFbc.split(".").slice(3).join(".");
    const cookieClickId = fbc?.split(".").slice(3).join(".");
    if (landingClickId !== cookieClickId) fbc = landingFbc;
  }

  if (ip && isIP(ip)) userData.client_ip_address = ip;
  if (userAgent) userData.client_user_agent = userAgent.slice(0, 1024);
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;
  return userData;
}

export async function handleMetaConversionsRequest(request: Request): Promise<Response> {
  // Next may normalize the internal URL to localhost; Host retains the public domain.
  const requestUrl = new URL(request.url);
  const host = request.headers.get("host") ?? requestUrl.host;
  const forwardedProtocol = request.headers.get("x-forwarded-proto");
  const protocol = forwardedProtocol === "http" || forwardedProtocol === "https"
    ? `${forwardedProtocol}:` : requestUrl.protocol;
  let origin: string;
  try {
    origin = new URL(`${protocol}//${host}`).origin;
  } catch {
    return Response.json({ error: "Origen no permitido." }, { status: 403 });
  }
  if (request.headers.get("origin") !== origin) {
    return Response.json({ error: "Origen no permitido." }, { status: 403 });
  }
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return Response.json({ error: "Se requiere JSON." }, { status: 415 });
  }

  let body: unknown;
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) {
      return Response.json({ error: "Petición demasiado grande." }, { status: 413 });
    }
    body = JSON.parse(text);
  } catch {
    return Response.json({ error: "JSON inválido." }, { status: 400 });
  }

  if (!isRecord(body) || body.consent !== true) {
    return Response.json({ error: "Se requiere consentimiento." }, { status: 403 });
  }
  if (!Array.isArray(body.events) || body.events.length < 1 || body.events.length > 3) {
    return Response.json({ error: "Lote de eventos inválido." }, { status: 400 });
  }

  const now = Math.floor(Date.now() / 1000);
  const events = body.events.map((event: unknown) => parseEvent(event, origin, now));
  if (events.some((event) => event === null)) {
    return Response.json({ error: "Evento inválido." }, { status: 400 });
  }

  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  const token = process.env.META_CONVERSIONS_API_ACCESS_TOKEN?.trim();
  const version = process.env.META_GRAPH_API_VERSION?.trim() || "v26.0";
  if (!pixelId || !token) return new Response(null, { status: 204 });
  if (!/^\d{1,30}$/.test(pixelId) || !/^v\d{1,3}\.\d+$/.test(version)) {
    console.error("Meta Conversions API: configuración inválida del píxel o de la versión.");
    return Response.json({ error: "Configuración de Meta inválida." }, { status: 503 });
  }

  const userData = getUserData(request, body.fbc);
  const testEventCode = process.env.META_CONVERSIONS_API_TEST_EVENT_CODE?.trim();

  try {
    const response = await fetch(`https://graph.facebook.com/${version}/${pixelId}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
      body: JSON.stringify({
        data: events.map((event) => ({ ...event, action_source: "website", user_data: userData })),
        ...(testEventCode ? { test_event_code: testEventCode } : {}),
      }),
    });
    const result: unknown = await response.json();
    if (!response.ok || !isRecord(result) || result.events_received !== events.length) {
      // Meta error messages can contain credentials; log only the response status.
      console.error("Meta Conversions API: envío rechazado.", { status: response.status });
      return Response.json({ error: "Meta no aceptó los eventos." }, { status: 502 });
    }
    return Response.json({ events_received: result.events_received });
  } catch {
    console.error("Meta Conversions API: no se pudo completar el envío.");
    return Response.json({ error: "No se pudo conectar con Meta." }, { status: 502 });
  }
}
