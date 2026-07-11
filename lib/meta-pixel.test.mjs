import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import {
  createMetaPixelEventPayload,
  trackMetaPixelContactLeadClick,
} from "./meta-pixel.ts";

afterEach(() => {
  Reflect.deleteProperty(globalThis, "window");
});

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

test("trackMetaPixelContactLeadClick sends Contact and Lead events", () => {
  const calls = [];
  globalThis.window = {
    fbq: (...args) => calls.push(args),
  };

  trackMetaPixelContactLeadClick({
    label: "Consultar por Desarrollo web",
    location: "services_section",
    method: "whatsapp",
    service: "Desarrollo web",
  });

  assert.deepEqual(calls, [
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
    ],
  ]);
});

test("trackMetaPixelContactLeadClick is a no-op when fbq is not available", () => {
  globalThis.window = {};

  assert.doesNotThrow(() => {
    trackMetaPixelContactLeadClick({
      label: "Contactanos",
      location: "floating_whatsapp",
      method: "whatsapp",
    });
  });
});
