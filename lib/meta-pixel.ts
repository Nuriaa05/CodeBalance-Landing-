import { COOKIE_CONSENT_ACCEPTED_VALUE, COOKIE_CONSENT_KEY } from "./cookie-consent.ts";

export type MetaPixelContactMethod = "whatsapp" | "email";

type MetaPixelEventName = "PageView" | "Contact" | "Lead";
type MetaPixelEventValue = string | number | boolean;
type MetaPixelEventPayload = Record<string, MetaPixelEventValue>;
type MetaPixelQueue = (
  command: "track",
  eventName: MetaPixelEventName,
  payload?: MetaPixelEventPayload,
  options?: { eventID: string }
) => void;

type MetaPixelWindow = {
  fbq?: MetaPixelQueue;
  localStorage: Pick<Storage, "getItem">;
  location: Pick<Location, "href">;
  fetch?: typeof fetch;
};

export type MetaConversionEvent = {
  event_name: MetaPixelEventName;
  event_id: string;
  event_time: number;
  event_source_url: string;
  custom_data: MetaPixelEventPayload;
};

export type MetaPixelContactLeadInput = {
  label: string;
  location: string;
  method: MetaPixelContactMethod;
  service?: string;
};

function removeEmptyPayloadValues(
  payload: Record<string, MetaPixelEventValue | undefined>
): MetaPixelEventPayload {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== "")
  ) as MetaPixelEventPayload;
}

function getMetaPixelWindow() {
  return (globalThis as typeof globalThis & { window?: MetaPixelWindow }).window;
}

export function createMetaPixelEventPayload({
  label,
  location,
  method,
  service,
}: MetaPixelContactLeadInput) {
  return removeEmptyPayloadValues({
    content_category: "contact",
    content_name: label,
    contact_method: method,
    event_location: location,
    service_name: service,
  });
}

function trackMetaPixelEvents(inputs: { name: MetaPixelEventName; payload: MetaPixelEventPayload }[]) {
  const browser = getMetaPixelWindow();
  if (!browser) return;

  try {
    if (browser.localStorage.getItem(COOKIE_CONSENT_KEY) !== COOKIE_CONSENT_ACCEPTED_VALUE) return;

    const url = new URL(browser.location.href);
    const events: MetaConversionEvent[] = inputs.map(({ name, payload }) => ({
      event_name: name,
      event_id: globalThis.crypto.randomUUID(),
      event_time: Math.floor(Date.now() / 1000),
      event_source_url: `${url.origin}${url.pathname}`,
      custom_data: payload,
    }));

    for (const event of events) {
      try {
        browser.fbq?.("track", event.event_name, event.custom_data, { eventID: event.event_id });
      } catch {
        // A blocked pixel must not prevent the server event or the contact action.
      }
    }

    const fbclid = url.searchParams.get("fbclid");
    const fbc = fbclid && /^[A-Za-z0-9_-]{1,500}$/.test(fbclid)
      ? `fb.1.${Date.now()}.${fbclid}`
      : undefined;

    void browser.fetch?.("/api/meta/conversions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      keepalive: true,
      body: JSON.stringify({ consent: true, events, fbc }),
    }).catch(() => undefined);
  } catch {
    // Analytics must not interrupt navigation when storage or the browser is unavailable.
  }
}

export function trackMetaPixelPageView() {
  trackMetaPixelEvents([{ name: "PageView", payload: {} }]);
}

export function trackMetaPixelContactLeadClick(input: MetaPixelContactLeadInput) {
  const contactPayload = createMetaPixelEventPayload(input);

  trackMetaPixelEvents([
    { name: "Contact", payload: contactPayload },
    {
      name: "Lead",
      payload: {
        ...contactPayload,
        content_category: "lead",
        lead_type: "contact_click",
      },
    },
  ]);
}
