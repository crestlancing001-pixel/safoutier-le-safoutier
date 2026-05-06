import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle } from "lucide-react";

export const FloatingButtons = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {visible && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="w-12 h-12 rounded-full bg-primary text-primary-foreground hover:brightness-110 transition-all flex items-center justify-center shadow-lg animate-fade-in"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
      <a
        href="https://wa.me/237681137452"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="pulse-ring relative w-14 h-14 rounded-full bg-whatsapp text-whatsapp-foreground hover:brightness-110 transition-all flex items-center justify-center shadow-xl"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
};
