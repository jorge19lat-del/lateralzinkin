import type { Dict } from "@/lib/i18n";
import { site } from "@/lib/site";

// Si NEXT_PUBLIC_BOOKING_URL está configurada (Cal.com, Calendly…), se incrusta el calendario.
export default function Booking({ t }: { t: Dict }) {
  if (!site.bookingUrl) {
    return <p className="muted">{t.contact.bookingPending}</p>;
  }
  return <iframe className="booking-frame" src={site.bookingUrl} title={t.contact.bookingTitle} loading="lazy" />;
}
