export type MetaPixelContactMethod = "whatsapp" | "email";

type MetaPixelEventName = "Contact" | "Lead";
type MetaPixelEventValue = string | number | boolean;
type MetaPixelEventPayload = Record<string, MetaPixelEventValue>;
type MetaPixelQueue = (
  command: "track",
  eventName: MetaPixelEventName,
  payload?: MetaPixelEventPayload
) => void;

type MetaPixelWindow = {
  fbq?: MetaPixelQueue;
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

function trackMetaPixelEvent(eventName: MetaPixelEventName, payload: MetaPixelEventPayload) {
  const fbq = getMetaPixelWindow()?.fbq;

  if (!fbq) return;

  fbq("track", eventName, payload);
}

export function trackMetaPixelContactLeadClick(input: MetaPixelContactLeadInput) {
  const contactPayload = createMetaPixelEventPayload(input);

  trackMetaPixelEvent("Contact", contactPayload);
  trackMetaPixelEvent("Lead", {
    ...contactPayload,
    content_category: "lead",
    lead_type: "contact_click",
  });
}
