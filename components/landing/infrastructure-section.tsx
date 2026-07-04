"use client";

import { useEffect, useState, useRef } from "react";

type ProjectStatus = "production" | "development";
type ProjectLinkKey =
  | "stockAdmin"
  | "medicalLanding"
  | "chacoImplantes"
  | "ecommerceBackend"
  | "lozanoManagement"
  | "neutronMarketing";

const projectLinks: Record<ProjectLinkKey, string | null> = {
  // TODO: agregar link real cuando esté disponible.
  stockAdmin: null,
  medicalLanding: "https://drmasedo.com/",
  chacoImplantes: null,
  ecommerceBackend: null,
  lozanoManagement: null,
  neutronMarketing: "https://www.instagram.com/nraccesoriosok/",
};

const projects: Array<{
  id: ProjectLinkKey;
  name: string;
  category: string;
  status: ProjectStatus;
  href: string | null;
}> = [
  {
    id: "medicalLanding",
    name: "Landing médica profesional",
    category: "Sitio institucional · En producción",
    status: "production",
    href: projectLinks.medicalLanding,
  },
  {
    id: "neutronMarketing",
    name: "Neutron Tecnología SAS",
    category: "Marketing y presencia digital · En producción",
    status: "production",
    href: projectLinks.neutronMarketing,
  },
  {
    id: "stockAdmin",
    name: "Sistema administrativo de stock",
    category: "Sistema de gestión · En producción",
    status: "production",
    href: projectLinks.stockAdmin,
  },
  {
    id: "chacoImplantes",
    name: "Chaco Implantes",
    category: "Sitio institucional · En desarrollo",
    status: "development",
    href: projectLinks.chacoImplantes,
  },
  {
    id: "ecommerceBackend",
    name: "Backend e-commerce",
    category: "Backend a medida · En desarrollo",
    status: "development",
    href: projectLinks.ecommerceBackend,
  },
  {
    id: "lozanoManagement",
    name: "Sistema de gestión — Lozano Congelados",
    category: "Sistema de gestión · En desarrollo",
    status: "development",
    href: projectLinks.lozanoManagement,
  },
];

const statusDotStyles = {
  production: {
    active: "bg-[#22C55E]",
    idle: "bg-[#22C55E]/60",
  },
  development: {
    active: "bg-[#b9923c]",
    idle: "bg-[#b9923c]/55",
  },
};

function ProjectCaseButton({ href, status }: { href: string | null; status: ProjectStatus }) {
  const buttonClassName =
    "shrink-0 rounded-full border border-[#0f60ec] px-4 py-2 text-xs font-medium text-[#0f60ec] transition-colors duration-200";

  if (status === "development") {
    return null;
  }

  if (!href) {
    return (
      <span aria-disabled="true" className={buttonClassName}>
        Ver caso
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${buttonClassName} hover:bg-[#0f60ec] hover:text-white`}
    >
      Ver caso
    </a>
  );
}

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
      setActiveLocation((prev) => (prev + 1) % projects.length);
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

              {/* Projects */}
              <div>
                {projects.map((project, index) => {
                  const statusClass = statusDotStyles[project.status];
                  const isActive = activeLocation === index;

                  return (
                  <div
                    key={project.id}
                    className={`px-6 py-5 border-b border-foreground/5 last:border-b-0 flex items-center justify-between gap-4 transition-all duration-300 ${
                      isActive ? "bg-accent/10" : ""
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <span 
                        className={`h-2 w-2 shrink-0 rounded-full transition-colors duration-300 ${
                          isActive ? statusClass.active : statusClass.idle
                        }`}
                      />
                      <div className="min-w-0">
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-muted-foreground">{project.category}</div>
                      </div>
                    </div>
                    <ProjectCaseButton href={project.href} status={project.status} />
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
