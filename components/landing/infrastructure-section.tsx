"use client";

import { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";
import { OUTLINE_CTA_CLASS } from "./cta-styles";
import { createWhatsAppUrl } from "./whatsapp";

type ProjectStatus = "production" | "development";
type ProjectLinkKey =
  | "stockAdmin"
  | "medicalLanding"
  | "chacoImplantes"
  | "ecommerceBackend"
  | "lozanoManagement"
  | "neutronMarketing";

const projectLinks: Record<ProjectLinkKey, string | null> = {
  stockAdmin: "https://youtu.be/3Svtx7zdaRU",
  medicalLanding: "https://drmasedo.com/",
  chacoImplantes: null,
  ecommerceBackend: null,
  lozanoManagement: "https://youtu.be/xLqZuCoOkx8",
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
    id: "lozanoManagement",
    name: "Sistema de gestión — Lozano Congelados",
    category: "Sistema de gestión · En producción",
    status: "production",
    href: projectLinks.lozanoManagement,
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
    name: "Neutron Tecnología SAS — E-commerce",
    category: "E-commerce a medida · En desarrollo",
    status: "development",
    href: projectLinks.ecommerceBackend,
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

type ProjectVideo = {
  title: string;
  embedUrl: string;
};

function getYouTubeVideoId(href: string) {
  try {
    const url = new URL(href);
    const hostname = url.hostname.replace(/^www\./, "");

    if (hostname === "youtu.be") {
      return url.pathname.split("/").filter(Boolean)[0] ?? null;
    }

    if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      if (url.pathname.startsWith("/watch")) return url.searchParams.get("v");
      if (url.pathname.startsWith("/embed/") || url.pathname.startsWith("/shorts/")) {
        return url.pathname.split("/").filter(Boolean)[1] ?? null;
      }
    }
  } catch {
    return null;
  }

  return null;
}

function getYouTubeEmbedUrl(href: string) {
  const videoId = getYouTubeVideoId(href);
  return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0` : null;
}

function ProjectCaseButton({
  href,
  name,
  status,
  onOpenVideo,
}: {
  href: string | null;
  name: string;
  status: ProjectStatus;
  onOpenVideo: (video: ProjectVideo) => void;
}) {
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

  const videoEmbedUrl = getYouTubeEmbedUrl(href);

  if (videoEmbedUrl) {
    return (
      <button
        type="button"
        onClick={() => onOpenVideo({ title: name, embedUrl: videoEmbedUrl })}
        className={`${buttonClassName} hover:bg-[#0f60ec] hover:text-white`}
      >
        Ver caso
      </button>
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
  const [caseCtaHasEntered, setCaseCtaHasEntered] = useState(false);
  const [caseCtaEntranceComplete, setCaseCtaEntranceComplete] = useState(false);
  const [activeVideo, setActiveVideo] = useState<ProjectVideo | null>(null);
  const [activeLocation, setActiveLocation] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const caseCtaRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const caseCta = caseCtaRef.current;

    if (!caseCta) return;

    if (typeof IntersectionObserver === "undefined") {
      const frame = window.requestAnimationFrame(() => setCaseCtaHasEntered(true));
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setCaseCtaHasEntered(true);
        observer.unobserve(entry.target);
      },
      {
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    observer.observe(caseCta);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!caseCtaHasEntered) return;

    const timeout = window.setTimeout(() => {
      setCaseCtaEntranceComplete(true);
    }, 700);

    return () => window.clearTimeout(timeout);
  }, [caseCtaHasEntered]);

  useEffect(() => {
    if (!activeVideo) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveVideo(null);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeVideo]);

  return (
    <section id="infraestructura" ref={sectionRef} className="relative overflow-hidden bg-[#eaf1fd] py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-x-24 lg:gap-y-8">
          {/* Left: Content */}
          <div
            className={`order-1 transition-all duration-700 lg:col-start-1 lg:row-start-1 lg:self-end ${
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
            <p className="text-xl text-muted-foreground leading-relaxed mb-5">
              Cada proyecto es distinto, pero todos comparten lo mismo: una solución pensada de punta a punta,
              del diseño a la puesta en producción.
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Estos son algunos de los proyectos en los que estamos trabajando hoy.
            </p>
          </div>

          {/* Right: Location list */}
          <div
            className={`order-2 transition-all duration-700 delay-200 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <div className="border border-foreground/10">
              {/* Header */}
              <div className="px-6 py-4 border-b border-foreground/10 flex items-center justify-between">
                <span className="text-sm font-mono text-muted-foreground">Nuestros proyectos</span>
                <span className="flex items-center gap-2 text-xs font-mono text-accent">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  4 en producción
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
                    <ProjectCaseButton
                      href={project.href}
                      name={project.name}
                      status={project.status}
                      onOpenVideo={setActiveVideo}
                    />
                  </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div ref={caseCtaRef} className="order-3 flex flex-col items-center gap-4 text-center lg:col-start-1 lg:row-start-2 lg:items-start lg:self-start lg:text-left">
            <p
              className={`font-display text-2xl tracking-tight text-foreground motion-safe:transition-[opacity,translate] motion-safe:duration-500 motion-safe:ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
                caseCtaHasEntered ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
              }`}
            >
              ¿Tenés un proyecto en mente?
            </p>
            <a
              href={createWhatsAppUrl("Hola, quiero contarles sobre mi proyecto.")}
              target="_blank"
              rel="noopener noreferrer"
              className={`${OUTLINE_CTA_CLASS} motion-safe:transition-[background-color,border-color,color,opacity,translate] motion-safe:ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
                caseCtaHasEntered ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
              } ${
                caseCtaHasEntered && !caseCtaEntranceComplete ? "motion-safe:delay-200" : "motion-safe:delay-0"
              } ${
                caseCtaEntranceComplete ? "motion-safe:duration-200" : "motion-safe:duration-500"
              }`}
            >
              Contanos tu proyecto
            </a>
          </div>
        </div>
      </div>

      {activeVideo && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-foreground/65 px-4 py-8 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Video de ${activeVideo.title}`}
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl border border-background/20 bg-background shadow-[0_32px_90px_rgba(18,30,82,0.25)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-foreground/10 px-4 py-3 sm:px-5">
              <p className="text-sm font-medium text-foreground">{activeVideo.title}</p>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors duration-200 hover:bg-foreground/5 hover:text-foreground"
                aria-label="Cerrar video"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div className="aspect-video bg-foreground">
              <iframe
                className="h-full w-full"
                src={activeVideo.embedUrl}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
