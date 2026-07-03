"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { siWhatsapp, type SimpleIcon } from "simple-icons";
import { AnimatedTetrahedron } from "./animated-tetrahedron";

const WHATSAPP_URL = "https://wa.me/5493625335330";

function SimpleIconLogo({ icon }: { icon: SimpleIcon }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path d={icon.path} fill="currentColor" />
    </svg>
  );
}

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
    <section id="contacto" ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div
          className={`relative border border-foreground/20 bg-card/60 shadow-[0_32px_90px_rgba(18,30,82,0.10)] transition-all duration-1000 ${
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
          
          <div className="relative z-10 px-8 lg:px-16 py-16 lg:py-24">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              {/* Left content */}
              <div className="flex-1">
                <h2 className="text-4xl lg:text-7xl font-display tracking-tight mb-8 leading-[0.95]">
                  Listo para crear
                  <br />
                  algo grande?
                </h2>

                <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-xl">
                  Súmate a miles de equipos que lanzan más rápido con CodeBalance.
                  Empieza gratis y escala sin límites.
                </p>

                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-[#0f60ec] hover:bg-[#0f60ec] text-white px-8 h-14 text-base rounded-full group"
                  >
                    <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                      <SimpleIconLogo icon={siWhatsapp} />
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
          <div className="absolute top-0 right-0 w-32 h-32 border-b border-l border-foreground/10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 border-t border-r border-foreground/10" />
        </div>
      </div>
    </section>
  );
}
