"use client";

import { useEffect, useState } from "react";
import { WHATSAPP_CONTACT_URL, WhatsAppIcon } from "./whatsapp";

export function FloatingWhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("inicio");

    if (!hero || typeof IntersectionObserver === "undefined") {
      let frameId: number | null = null;

      const updateVisibility = () => {
        setIsVisible(window.scrollY > 600);
        frameId = null;
      };

      const handleScroll = () => {
        if (frameId !== null) return;
        frameId = window.requestAnimationFrame(updateVisibility);
      };

      const initialFrame = window.requestAnimationFrame(updateVisibility);

      window.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("resize", handleScroll);

      return () => {
        window.cancelAnimationFrame(initialFrame);
        if (frameId !== null) window.cancelAnimationFrame(frameId);
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleScroll);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes whatsapp-float-pulse {
            0%, 76% {
              opacity: 0;
              transform: scale(1);
            }
            82% {
              opacity: 0.32;
            }
            100% {
              opacity: 0;
              transform: scale(1.65);
            }
          }

          @media (prefers-reduced-motion: no-preference) {
            .whatsapp-float-pulse {
              animation: whatsapp-float-pulse 4.8s ease-out infinite;
            }
          }
        `}
      </style>

      <a
        href={WHATSAPP_CONTACT_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className={`fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_14px_34px_rgba(37,211,102,0.28)] transition-[opacity,transform] duration-300 ease-out sm:h-[60px] sm:w-[60px] ${
          isVisible
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <span className="whatsapp-float-pulse pointer-events-none absolute inset-0 rounded-full bg-[#25D366]" />
        <span className="relative flex items-center justify-center">
          <WhatsAppIcon className="h-7 w-7" />
        </span>
      </a>
    </>
  );
}
