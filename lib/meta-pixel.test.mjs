import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import * as metaPixel from "./meta-pixel.ts";
import {
  createMetaPixelEventPayload,
  trackMetaPixelContactLeadClick,
} from "./meta-pixel.ts";

afterEach(() => {
  Reflect.deleteProperty(globalThis, "window");
});

function createBrowser({ consent = "accepted", fbqAvailable = true } = {}) {
  const pixelCalls = [];
  const requests = [];

  globalThis.window = {
    localStorage: { getItem: () => consent },
    location: { href: "https://codebalance.test/?utm_source=meta#contacto" },
    fetch: async (...args) => {
      requests.push(args);
      return new Response(null, { status: 204 });
    },
    ...(fbqAvailable ? { fbq: (...args) => pixelCalls.push(args) } : {}),
  };

  return { pixelCalls, requests };
}

test("createMetaPixelEventPayload keeps useful contact metadata and removes empty values", () => {
  assert.deepEqual(
    createMetaPixelEventPayload({
      label: "Contactanos",
      location: "cta_section",
      method: "whatsapp",
      service: "",
    }),
    {
      content_category: "contact",
      content_name: "Contactanos",
      contact_method: "whatsapp",
      event_location: "cta_section",
    }
  );
});

test("contact clicks send the same event IDs through the pixel and Conversions API", () => {
  const { pixelCalls, requests } = createBrowser();

  trackMetaPixelContactLeadClick({
    label: "Consultar por Desarrollo web",
    location: "services_section",
    method: "whatsapp",
    service: "Desarrollo web",
  });

  assert.equal(requests.length, 1);
  const [url, options] = requests[0];
  const { consent, events } = JSON.parse(options.body);
  assert.equal(url, "/api/meta/conversions");
  assert.equal(options.keepalive, true);
  assert.equal(consent, true);
  assert.equal(events.length, 2);
  assert.notEqual(events[0].event_id, events[1].event_id);
  assert.equal(events[0].event_source_url, "https://codebalance.test/");
  assert.equal(events[0].event_name, "Contact");
  assert.equal(events[1].event_name, "Lead");

  assert.deepEqual(pixelCalls, [
    [
      "track",
      "Contact",
      {
        content_category: "contact",
        content_name: "Consultar por Desarrollo web",
        contact_method: "whatsapp",
        event_location: "services_section",
        service_name: "Desarrollo web",
      },
      { eventID: events[0].event_id },
    ],
    [
      "track",
      "Lead",
      {
        content_category: "lead",
        content_name: "Consultar por Desarrollo web",
        contact_method: "whatsapp",
        event_location: "services_section",
        lead_type: "contact_click",
        service_name: "Desarrollo web",
      },
      { eventID: events[1].event_id },
    ],
  ]);
});

test("Conversions API still receives contact clicks when the pixel is unavailable", () => {
  const { requests } = createBrowser({ fbqAvailable: false });

  assert.doesNotThrow(() => {
    trackMetaPixelContactLeadClick({
      label: "Contactanos",
      location: "floating_whatsapp",
      method: "whatsapp",
    });
  });
  assert.equal(requests.length, 1);
});

test("tracking requires accepted cookie consent even when fbq exists", () => {
  const { pixelCalls, requests } = createBrowser({ consent: null });

  trackMetaPixelContactLeadClick({ label: "Contactanos", location: "cta", method: "email" });

  assert.deepEqual(pixelCalls, []);
  assert.deepEqual(requests, []);
});

test("tracking does not interrupt contact actions when storage or network fails", async () => {
  createBrowser();
  window.localStorage.getItem = () => { throw new Error("Storage blocked"); };
  assert.doesNotThrow(() => trackMetaPixelContactLeadClick({ label: "Contacto", location: "cta", method: "email" }));

  createBrowser();
  window.fetch = async () => { throw new Error("Offline"); };
  window.fbq = () => { throw new Error("Pixel blocked"); };
  assert.doesNotThrow(() => trackMetaPixelContactLeadClick({ label: "Contacto", location: "cta", method: "email" }));
  await new Promise((resolve) => setImmediate(resolve));
});

test("PageView uses a shared identifier and derives fbc only from a real fbclid", () => {
  const { pixelCalls, requests } = createBrowser();
  window.location.href = "https://codebalance.test/?fbclid=real-click-id&email=private#contacto";
  assert.equal(typeof metaPixel.trackMetaPixelPageView, "function");

  metaPixel.trackMetaPixelPageView();

  const payload = JSON.parse(requests[0][1].body);
  assert.match(payload.fbc, /^fb\.1\.\d+\.real-click-id$/);
  assert.deepEqual(pixelCalls, [["track", "PageView", {}, { eventID: payload.events[0].event_id }]]);
  assert.equal(payload.events[0].event_source_url, "https://codebalance.test/");
});

test("tracking without fbclid does not fabricate an attribution ID", () => {
  const { requests } = createBrowser();
  trackMetaPixelContactLeadClick({ label: "Contacto", location: "cta", method: "email" });
  assert.equal(JSON.parse(requests[0][1].body).fbc, undefined);
});
