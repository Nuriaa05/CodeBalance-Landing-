"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { AnimatedTetrahedron } from "./animated-tetrahedron";
import { WHATSAPP_CONTACT_URL, WhatsAppIcon } from "./whatsapp";

const CTA_TEXTURE_SYMBOLS = [
  { symbol: "+", x: 13, y: 11, size: 18, opacity: 0.06 },
  { symbol: "=", x: 74, y: 13, size: 16, opacity: 0.05 },
  { symbol: "*", x: 88, y: 24, size: 19, opacity: 0.07 },
  { symbol: "#", x: 18, y: 36, size: 15, opacity: 0.055 },
  { symbol: "+", x: 68, y: 39, size: 17, opacity: 0.06 },
  { symbol: "=", x: 84, y: 55, size: 15, opacity: 0.05 },
  { symbol: "*", x: 14, y: 69, size: 18, opacity: 0.065 },
  { symbol: "#", x: 59, y: 75, size: 16, opacity: 0.055 },
  { symbol: "+", x: 82, y: 84, size: 17, opacity: 0.06 },
  { symbol: "=", x: 33, y: 88, size: 15, opacity: 0.05 },
] as const;

export function CtaSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <section id="contacto" ref={sectionRef} className="relative overflow-hidden bg-[#ffffff] py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div
          className={`relative border border-foreground/20 bg-card/60 shadow-[0_32px_90px_rgba(18,30,82,0.10)] transition-all duration-1000 max-lg:border-t-2 max-lg:border-t-[#0f60ec] ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          onMouseMove={handleMouseMove}
        >
          {/* Spotlight effect */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(var(--navy-accent-rgb), 0.35), transparent 40%)`
            }}
          />
          <div className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden" aria-hidden="true">
            {CTA_TEXTURE_SYMBOLS.map((item, index) => (
              <span
                key={`${item.symbol}-${index}`}
                className="absolute select-none font-mono leading-none text-foreground"
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  fontSize: item.size,
                  opacity: item.opacity,
                }}
              >
                {item.symbol}
              </span>
            ))}
          </div>
          
          <div className="relative z-10 px-8 lg:px-16 py-16 lg:py-24">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              {/* Left content */}
              <div className="flex-1">
                <span className="mb-6 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  <span className="h-px w-8 bg-muted-foreground/30" />
                  Contacto
                </span>

                <h2 className="text-4xl lg:text-7xl font-display tracking-tight mb-8 leading-[0.95]">
                  Listo para crear
                  <br />
                  algo grande?
                </h2>

                <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-xl">
                  Contanos qué querés lograr y diseñamos una solución digital, financiera o estratégica para hacerlo crecer con claridad.
                </p>

                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-[#0f60ec] hover:bg-[#0f60ec] text-white px-8 h-14 text-base rounded-full group"
                  >
                    <a href={WHATSAPP_CONTACT_URL} target="_blank" rel="noreferrer">
                      <WhatsAppIcon />
                      Contactanos
                    </a>
                  </Button>
                </div>
              </div>

              {/* Right animation */}
              <div className="hidden aspect-square min-w-[360px] max-w-[520px] flex-1 items-center justify-center overflow-visible lg:flex">
                <AnimatedTetrahedron />
              </div>
            </div>
          </div>

          {/* Decorative corner */}
          <div className="absolute top-0 right-0 hidden h-32 w-32 border-b border-l border-foreground/10 lg:block" />
          <div className="absolute bottom-0 left-0 hidden h-32 w-32 border-t border-r border-foreground/10 lg:block" />
        </div>
      </div>
    </section>
  );
}
