import { siWhatsapp } from "simple-icons";

export const WHATSAPP_URL = "https://wa.me/5493625335330";
export const WHATSAPP_CONTACT_MESSAGE = "Hola, quiero contactarme con CodeBalance.";

export function createWhatsAppUrl(message: string) {
  return `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_CONTACT_URL = createWhatsAppUrl(WHATSAPP_CONTACT_MESSAGE);

export function WhatsAppIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d={siWhatsapp.path} fill="currentColor" />
    </svg>
  );
}
