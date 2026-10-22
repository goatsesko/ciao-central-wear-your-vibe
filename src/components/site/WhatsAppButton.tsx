import { toast } from "sonner";
import { STORE } from "@/lib/format";
import { WhatsAppIcon } from "./BrandIcons";

export function whatsappUrl(text = "Hi Ciao Central! I have a question.") {
  return STORE.whatsapp ? `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(text)}` : "";
}

export function WhatsAppButton() {
  const url = whatsappUrl();
  const cls = "fixed bottom-4 right-4 z-30 grid size-14 place-items-center rounded-full bg-whatsapp text-ink-foreground shadow-lg transition-transform hover:scale-105 md:bottom-6 md:right-6";
  return url ? (
    <a href={url} target="_blank" rel="noreferrer" aria-label="Chat with us on WhatsApp" className={cls}>
      <WhatsAppIcon className="size-7" />
    </a>
  ) : (
    <button aria-label="Chat with us on WhatsApp" className={cls} onClick={() => toast("WhatsApp chat is coming soon.")}>
      <WhatsAppIcon className="size-7" />
    </button>
  );
}
