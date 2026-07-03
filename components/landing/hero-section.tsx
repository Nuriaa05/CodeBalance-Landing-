"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { AnimatedGeometryLoop } from "./animated-geometry-loop";

const words = ["crear", "construir", "escalar", "lanzar"];

export function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="inicio" className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Animated geometry background */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] lg:w-[800px] lg:h-[800px] opacity-40 pointer-events-none">
        <AnimatedGeometryLoop />
      </div>
      
      {/* Subtle grid lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {[...Array(8)].map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute h-px bg-foreground/10"
            style={{
              top: `${12.5 * (i + 1)}%`,
              left: 0,
              right: 0,
            }}
          />
        ))}
        {[...Array(12)].map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute w-px bg-foreground/10"
            style={{
              left: `${8.33 * (i + 1)}%`,
              top: 0,
              bottom: 0,
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 py-32 lg:py-40">
        {/* Eyebrow */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground">
            <span className="w-8 h-px bg-foreground/30" />
            La plataforma para equipos modernos
          </span>
        </div>
        
        {/* Main headline */}
        <div className="mb-12">
          <h1
            className="text-[clamp(3rem,12vw,10rem)] font-display leading-[0.9] tracking-tight"
            aria-label={`La agencia para ${words[wordIndex]}`}
          >
            <span className="block" aria-hidden="true">La agencia</span>
            <span className="block" aria-hidden="true">
              para{" "}
              <span className="relative inline-block">
                <span 
                  key={wordIndex}
                  className="inline-flex"
                >
                  {words[wordIndex].split("").map((char, i) => (
                    <span
                      key={`${wordIndex}-${i}`}
                      className="inline-block animate-char-in"
                      style={{
                        animationDelay: `${i * 50}ms`,
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-foreground/10" />
              </span>
            </span>
          </h1>
        </div>
        
        {/* Description */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-end">
          <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-xl">
            En CodeBalance combinamos creatividad, análisis y tecnología para ofrecer soluciones personalizadas que impulsen el crecimiento de negocios en un entorno cada vez más digital.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Button 
              asChild
              size="lg" 
              className="bg-[#0f60ec] hover:bg-[#0f60ec] text-white px-8 h-14 text-base rounded-full group"
            >
              <a href="#contacto">
                Contactanos
                <ArrowRight data-icon="inline-end" className="ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </a>
            </Button>
            <Button 
              asChild
              size="lg" 
              variant="outline" 
              className="h-14 px-8 text-base rounded-full border-foreground/20 bg-card/35 hover:bg-accent/10"
            >
              <a href="#infraestructura">Ver casos</a>
            </Button>
          </div>
        </div>
        
      </div>
      
      {/* Scroll indicator */}
      
    </section>
  );
}
