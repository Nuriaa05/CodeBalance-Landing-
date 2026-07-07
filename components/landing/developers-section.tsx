"use client";

import Image from "next/image";
import { Code2, Megaphone, TrendingUp, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const aboutParagraphs = [
  "En CodeBalance creemos que un negocio crece cuando la estrategia, la tecnología y las finanzas trabajan en conjunto.",
  "Somos una agencia fundada por un equipo con perfiles profesionales complementarios: dos desarrolladores especializados en soluciones digitales y una contadora enfocada en estrategia financiera, crecimiento empresarial y marketing. Esa combinación nos permite entender un negocio de forma integral, creando soluciones que no solo se ven bien, sino que también generan resultados.",
  "No nos limitamos a desarrollar una página web, una campaña o un sistema. Analizamos cada proyecto desde una visión estratégica para ayudar a nuestros clientes a optimizar procesos, aumentar su rentabilidad y potenciar su presencia digital.",
  "Nuestro objetivo es convertirnos en un aliado para empresas y emprendedores que buscan centralizar sus necesidades en un solo lugar, con un equipo que comprende tanto la parte técnica como la financiera de cada decisión.",
];

const chips: Array<{ label: string; Icon: LucideIcon }> = [
  { label: "Desarrollo web", Icon: Code2 },
  { label: "Estrategia financiera", Icon: TrendingUp },
  { label: "Marketing", Icon: Megaphone },
];

export function DevelopersSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="developers" ref={sectionRef} className="relative overflow-hidden bg-[#ffffff] pt-20 pb-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-24 lg:items-center">
          {/* Left: Image */}
          <div
            className={`relative order-2 max-w-xl transition-all duration-700 lg:order-none ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="relative">
              <div
                className="pointer-events-none absolute -left-4 -top-4 z-0 h-full w-full rounded-2xl border-2 border-foreground"
                aria-hidden="true"
              />
              <div className="relative z-10 aspect-[4/5] overflow-hidden rounded-2xl border border-foreground/10 bg-card/60">
                <Image
                  src="/about-team.png"
                  alt="Equipo de CodeBalance"
                  fill
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div
            className={`contents transition-all duration-700 delay-100 lg:block ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="order-1 inline-flex items-center gap-3 text-sm font-mono text-muted-foreground lg:mb-6 lg:order-none">
              <span className="w-8 h-px bg-foreground/30" />
              Sobre nosotros
            </span>
            <h2 className="order-3 text-4xl lg:text-[2.5rem] font-display tracking-tight lg:mb-8 lg:order-none">
              Dos disciplinas.
              <br />
              <span className="text-muted-foreground">Una sola visión de negocio.</span>
            </h2>

            <div className="order-4 max-w-[680px] lg:order-none">
              {aboutParagraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mb-3.5 font-sans text-base leading-[1.75] text-muted-foreground lg:text-[17px]"
                >
                  {paragraph}
                </p>
              ))}

              <p className="mt-7 font-display text-lg font-medium leading-relaxed text-foreground lg:text-[19px]">
                En CodeBalance transformamos ideas en soluciones que impulsan el crecimiento.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {chips.map(({ label, Icon }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 py-1.5 pl-3 pr-4 text-[13px] text-muted-foreground sm:text-sm"
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
