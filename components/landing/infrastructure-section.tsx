"use client";

import { useEffect, useState, useRef } from "react";

const locations = [
  {
    city: "NR Fundas Personalizadas",
    region: "E-commerce · En producción",
    status: "production",
    link: "#",
  },
  {
    city: "Chaco Implantes",
    region: "Sitio institucional · En producción",
    status: "production",
    link: "#",
  },
  {
    city: "Neutron Tecnología SAS",
    region: "Plataforma e-commerce · En desarrollo",
    status: "development",
    link: "#",
  },
  {
    city: "Landing médica — completar nombre",
    region: "Salud · En producción",
    status: "production",
    link: "#",
  },
];

const statusDotStyles = {
  production: {
    active: "bg-accent",
    idle: "bg-accent/55",
  },
  development: {
    active: "bg-[#b9923c]",
    idle: "bg-[#b9923c]/55",
  },
};

export function InfrastructureSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeLocation, setActiveLocation] = useState(0);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLocation((prev) => (prev + 1) % locations.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="infraestructura" ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Content */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              Casos de éxito
            </span>
            <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-8">
              Proyectos reales.
              <br />
              <span className="text-muted-foreground">Resultados medibles.</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              Cada proyecto es distinto, pero todos comparten lo mismo: una solución pensada de punta a punta,
              del diseño a la puesta en producción.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="text-4xl lg:text-5xl font-display mb-2">5+</div>
                <div className="text-sm text-muted-foreground">Proyectos entregados</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-display mb-2">3</div>
                <div className="text-sm text-muted-foreground">Industrias distintas</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-display mb-2">100%</div>
                <div className="text-sm text-muted-foreground">A medida</div>
              </div>
            </div>
          </div>

          {/* Right: Location list */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <div className="border border-foreground/10">
              {/* Header */}
              <div className="px-6 py-4 border-b border-foreground/10 flex items-center justify-between">
                <span className="text-sm font-mono text-muted-foreground">Nuestros proyectos</span>
                <span className="flex items-center gap-2 text-xs font-mono text-accent">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  3 en producción
                </span>
              </div>

              {/* Locations */}
              <div>
                {locations.map((location, index) => {
                  const statusClass = statusDotStyles[location.status as keyof typeof statusDotStyles];
                  const isActive = activeLocation === index;

                  return (
                  <div
                    key={location.city}
                    className={`px-6 py-5 border-b border-foreground/5 last:border-b-0 flex items-center justify-between transition-all duration-300 ${
                      isActive ? "bg-accent/10" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span 
                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                          isActive ? statusClass.active : statusClass.idle
                        }`}
                      />
                      <div>
                        <div className="font-medium">{location.city}</div>
                        <div className="text-sm text-muted-foreground">{location.region}</div>
                      </div>
                    </div>
                    {isActive ? (
                      <a
                        href={location.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 rounded-full border border-[#0f60ec] px-4 py-2 text-xs font-medium text-[#0f60ec] transition-colors duration-200 hover:bg-[#0f60ec] hover:text-white"
                      >
                        Ver caso
                      </a>
                    ) : (
                      <span className="w-[72px]" aria-hidden="true" />
                    )}
                  </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
