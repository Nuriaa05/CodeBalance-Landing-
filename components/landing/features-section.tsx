"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

type VisualType = "web" | "deploy" | "ai" | "collab" | "digital";

const WHATSAPP_BASE_URL = "https://wa.me/5493625335330";
const OUTLINE_CTA_CLASS =
  "inline-flex shrink-0 items-center justify-center rounded-full border border-[#0f60ec] px-4 py-2 text-xs font-medium text-[#0f60ec] transition-colors duration-200 hover:bg-[#0f60ec] hover:text-white";
const SERVICE_OUTLINE_CTA_CLASS = `${OUTLINE_CTA_CLASS} max-md:active:border-[#0f60ec] max-md:active:bg-[rgba(15,96,236,0.08)] max-md:active:text-[#0f60ec]`;
const SERVICE_SCROLL_DELAY_MS = 420;

function whatsappMessageUrl(message: string) {
  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;
}

const servicePillars = [
  {
    number: "01",
    title: "Desarrollo web",
    summary: "Sitios y tiendas pensadas para presentar, vender y convertir con claridad.",
    visual: "web" as VisualType,
    services: [
      {
        name: "Landing page",
        description:
          "Una sola página enfocada en convertir: presenta tu producto o servicio y lleva al visitante a una acción concreta.",
      },
      {
        name: "Sitio multipage",
        description:
          "Varias secciones o páginas conectadas para negocios que necesitan contar más de una historia.",
      },
      {
        name: "E-commerce",
        description:
          "Tienda online con catálogo, carrito, checkout y medios de pago integrados, lista para vender.",
      },
      {
        name: "Sitio a medida",
        description:
          "Desarrollo a la medida cuando el proyecto necesita funcionalidades, integraciones o flujos propios del negocio.",
      },
    ],
  },
  {
    number: "02",
    title: "Sistemas y automatización",
    summary: "Herramientas internas, flujos y datos para ordenar la operación diaria.",
    visual: "ai" as VisualType,
    services: [
      {
        name: "Sistemas de administración y gestión",
        description:
          "Paneles y herramientas internas para organizar información, usuarios y operaciones del día a día.",
      },
      {
        name: "Automatización de procesos",
        description:
          "Eliminamos tareas repetitivas conectando herramientas y flujos para ganar tiempo y reducir errores.",
      },
      {
        name: "Integración y gestión de base de datos",
        description:
          "Diseño, integración y mantenimiento de bases de datos ordenadas, escalables y listas para sostener tu sistema.",
      },
    ],
  },
  {
    number: "03",
    title: "Presencia digital",
    summary: "Diseño, integración y SEO para fortalecer cómo se ve y se encuentra tu marca.",
    visual: "digital" as VisualType,
    services: [
      {
        name: "Diseño e integración",
        description:
          "Diseño visual coherente con tu marca, integrado a tu sitio o sistema existente sin romper lo que ya funciona.",
      },
      {
        name: "Mejora de presencia digital (SEO)",
        description:
          "Optimización técnica y de contenido para mejorar tu posicionamiento en buscadores y llegar a más clientes.",
      },
    ],
  },
  {
    number: "04",
    title: "Estrategia financiera",
    summary: "Planificación y control para crecer con decisiones basadas en información real.",
    visual: "deploy" as VisualType,
    services: [
      {
        name: "Estrategia financiera",
        description:
          "Diseñamos estrategias para optimizar la rentabilidad, ordenar las finanzas, mejorar el control del negocio y crecer con planificación: precios, presupuestos, rentabilidad, proyecciones y planificación estratégica.",
      },
    ],
  },
  {
    number: "05",
    title: "Marketing",
    summary: "Estrategias para atraer clientes, mejorar posicionamiento y aumentar conversiones.",
    visual: "collab" as VisualType,
    services: [
      {
        name: "Marketing",
        description:
          "Diseñamos estrategias para optimizar la rentabilidad, ordenar las finanzas, mejorar el control del negocio y crecer con planificación: precios, presupuestos, rentabilidad, proyecciones y planificación estratégica. Manejo impositivo de monotributibutistas y responsables inscriptos -persona física-.",
      },
    ],
  },
];

function WebDevelopmentVisual() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      <style>
        {`
          .web-code-line {
            stroke-dasharray: 72;
            stroke-dashoffset: 72;
            animation: webCodeReveal 4.8s ease-in-out infinite;
          }

          .web-accent-dot {
            transform-box: fill-box;
            transform-origin: center;
            animation: webAccentPulse 3.4s ease-in-out infinite;
          }

          @keyframes webCodeReveal {
            0%, 18% {
              stroke-dashoffset: 72;
              opacity: 0.18;
            }
            38%, 72% {
              stroke-dashoffset: 0;
              opacity: 0.72;
            }
            100% {
              stroke-dashoffset: 72;
              opacity: 0.18;
            }
          }

          @keyframes webAccentPulse {
            0%, 100% {
              opacity: 0.65;
              transform: scale(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.18);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .web-code-line,
            .web-accent-dot {
              animation: none;
            }

            .web-code-line {
              stroke-dashoffset: 0;
              opacity: 0.72;
            }
          }
        `}
      </style>

      <rect x="28" y="24" width="144" height="108" rx="6" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M 28 48 H 172" stroke="currentColor" strokeWidth="2" opacity="0.18" />

      <circle cx="42" cy="36" r="2.6" fill="currentColor" opacity="0.28" />
      <circle cx="54" cy="36" r="2.6" fill="currentColor" opacity="0.22" />
      <circle cx="66" cy="36" r="2.6" fill="currentColor" opacity="0.18" />
      <circle className="web-accent-dot" cx="154" cy="36" r="3" fill="#0f60ec" />

      <rect x="44" y="62" width="48" height="42" rx="4" fill="var(--background)" opacity="0.55" />
      <path d="M 66 90 L 54 80 L 66 70" fill="none" stroke="#0f60ec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 86 70 L 74 90" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M 86 70 L 98 80 L 86 90" fill="none" stroke="#0f60ec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />

      <path className="web-code-line" d="M 112 66 H 154" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path className="web-code-line" d="M 112 80 H 142" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animationDelay: "0.25s" }} />
      <path className="web-code-line" d="M 112 94 H 160" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animationDelay: "0.5s" }} />
      <path className="web-code-line" d="M 112 108 H 132" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animationDelay: "0.75s" }} />
    </svg>
  );
}

function DeployVisual() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      <defs>
        <clipPath id="deployClip">
          <rect x="30" y="20" width="140" height="120" rx="4" />
        </clipPath>
      </defs>
      
      {/* Container */}
      <rect x="30" y="20" width="140" height="120" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
      
      {/* Animated bars */}
      <g clipPath="url(#deployClip)">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect
            key={i}
            x="40"
            y={35 + i * 16}
            width="120"
            height="10"
            rx="2"
            fill="currentColor"
            opacity="0.15"
          >
            <animate
              attributeName="opacity"
              values="0.15;0.8;0.15"
              dur="2s"
              begin={`${i * 0.15}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="width"
              values="20;120;20"
              dur="2s"
              begin={`${i * 0.15}s`}
              repeatCount="indefinite"
            />
          </rect>
        ))}
      </g>
      
      {/* Progress indicator */}
      <circle cx="100" cy="155" r="3" fill="currentColor" opacity="0.3">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function AIVisual() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      {/* Central node */}
      <circle cx="100" cy="80" r="12" fill="currentColor">
        <animate attributeName="r" values="12;14;12" dur="2s" repeatCount="indefinite" />
      </circle>
      
      {/* Orbiting nodes */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i * 60) * (Math.PI / 180);
        const radius = 50;
        const nodeX = Number((100 + Math.cos(angle) * radius).toFixed(4));
        const nodeY = Number((80 + Math.sin(angle) * radius).toFixed(4));

        return (
          <g key={i}>
            {/* Connection line */}
            <line
              x1="100"
              y1="80"
              x2={nodeX}
              y2={nodeY}
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.3"
            >
              <animate
                attributeName="opacity"
                values="0.3;0.8;0.3"
                dur="2s"
                begin={`${i * 0.3}s`}
                repeatCount="indefinite"
              />
            </line>
            
            {/* Outer node */}
            <circle
              cx={nodeX}
              cy={nodeY}
              r="6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <animate
                attributeName="r"
                values="6;8;6"
                dur="2s"
                begin={`${i * 0.3}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        );
      })}
      
      {/* Pulse rings */}
      <circle cx="100" cy="80" r="30" fill="none" stroke="currentColor" strokeWidth="1" opacity="0">
        <animate attributeName="r" values="20;60" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function CollabVisual() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      {/* User A */}
      <g>
        <rect x="30" y="50" width="50" height="60" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <text x="55" y="85" textAnchor="middle" fontSize="20" fontFamily="monospace" fill="currentColor">A</text>
        <circle cx="55" cy="35" r="12" fill="none" stroke="currentColor" strokeWidth="2" />
      </g>
      
      {/* User B */}
      <g>
        <rect x="120" y="50" width="50" height="60" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <text x="145" y="85" textAnchor="middle" fontSize="20" fontFamily="monospace" fill="currentColor">B</text>
        <circle cx="145" cy="35" r="12" fill="none" stroke="currentColor" strokeWidth="2" />
      </g>
      
      {/* Connection */}
      <line x1="80" y1="80" x2="120" y2="80" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4">
        <animate attributeName="stroke-dashoffset" values="0;-8" dur="0.5s" repeatCount="indefinite" />
      </line>
      
      {/* Data packet */}
      <circle r="4" fill="currentColor">
        <animateMotion dur="1.5s" repeatCount="indefinite">
          <mpath href="#dataPath" />
        </animateMotion>
      </circle>
      <path id="dataPath" d="M 80 80 L 120 80" fill="none" />
      
      {/* Sync indicator */}
      <g transform="translate(100, 130)">
        <circle r="6" fill="none" stroke="currentColor" strokeWidth="2">
          <animate attributeName="r" values="6;10;6" dur="1s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  );
}

function DigitalPresenceVisual() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      <style>
        {`
          .digital-growth-line {
            stroke-dasharray: 190;
            stroke-dashoffset: 190;
            animation: digitalGrowthDraw 4.8s ease-in-out infinite;
          }

          .digital-growth-arrow {
            stroke-dasharray: 42;
            stroke-dashoffset: 42;
            animation: digitalGrowthDraw 4.8s ease-in-out infinite;
          }

          .digital-growth-tip {
            transform-box: fill-box;
            transform-origin: center;
            animation: digitalTipPulse 4.8s ease-in-out infinite;
          }

          @keyframes digitalGrowthDraw {
            0%, 14% {
              stroke-dashoffset: 190;
              opacity: 0.2;
            }
            48%, 78% {
              stroke-dashoffset: 0;
              opacity: 1;
            }
            100% {
              stroke-dashoffset: 0;
              opacity: 0.78;
            }
          }

          @keyframes digitalTipPulse {
            0%, 48%, 100% {
              opacity: 0.58;
              transform: scale(1);
            }
            64% {
              opacity: 0.95;
              transform: scale(1.18);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .digital-growth-line,
            .digital-growth-arrow,
            .digital-growth-tip {
              animation: none;
            }

            .digital-growth-line,
            .digital-growth-arrow {
              stroke-dashoffset: 0;
              opacity: 1;
            }
          }
        `}
      </style>

      <path
        d="M 40 116 L 72 94 L 98 102 L 128 70 L 158 44"
        fill="none"
        stroke="var(--background)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.36"
      />
      <path
        className="digital-growth-line"
        d="M 40 116 L 72 94 L 98 102 L 128 70 L 158 44"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="digital-growth-arrow"
        d="M 158 44 L 154 66 M 158 44 L 136 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ animationDelay: "0.45s" }}
      />

      <circle cx="72" cy="94" r="4" fill="var(--background)" stroke="currentColor" strokeWidth="1.5" opacity="0.55" />
      <circle cx="98" cy="102" r="3.5" fill="var(--background)" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <circle cx="128" cy="70" r="3.5" fill="var(--background)" stroke="currentColor" strokeWidth="1.5" opacity="0.45" />
      <circle className="digital-growth-tip" cx="158" cy="44" r="4" fill="#0f60ec" opacity="0.75" />
    </svg>
  );
}

function AnimatedVisual({ type }: { type: VisualType }) {
  switch (type) {
    case "web":
      return <WebDevelopmentVisual />;
    case "deploy":
      return <DeployVisual />;
    case "ai":
      return <AIVisual />;
    case "collab":
      return <CollabVisual />;
    case "digital":
      return <DigitalPresenceVisual />;
    default:
      return <WebDevelopmentVisual />;
  }
}

function ServicePillarCard({
  pillar,
  index,
  isOpen,
  onToggle,
  registerCardRef,
}: {
  pillar: typeof servicePillars[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  registerCardRef: (number: string, node: HTMLDivElement | null) => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentId = `service-pillar-${pillar.number}`;

  const setCardNode = useCallback(
    (node: HTMLDivElement | null) => {
      cardRef.current = node;
      registerCardRef(pillar.number, node);
    },
    [pillar.number, registerCardRef]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={setCardNode}
      className={`group relative scroll-mt-[104px] border transition-[border-color,background-color,box-shadow,opacity,transform] hover:border-accent/40 motion-reduce:transition-none md:scroll-mt-[120px] ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      } ${
        isOpen
          ? "border-[#0f60ec]/30 bg-card/60 shadow-[0_18px_55px_rgba(18,30,82,0.08)] duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          : "border-foreground/10 bg-card/45 shadow-none duration-[220ms] ease-[cubic-bezier(0.4,0,1,1)]"
      }`}
      style={{ transitionDelay: isVisible ? "0ms" : `${index * 70}ms` }}
    >
      <button
        type="button"
        className="grid w-full grid-cols-[auto_1fr_auto_auto] items-center gap-4 px-5 py-5 text-left sm:px-8 lg:gap-10 lg:py-8"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={onToggle}
      >
        <span className="font-mono text-sm text-muted-foreground">{pillar.number}</span>

        <span className="min-w-0">
          <span className="block text-2xl font-display leading-tight tracking-tight transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 motion-reduce:transition-none sm:text-3xl lg:text-4xl">
            {pillar.title}
          </span>
          <span className="mt-2 block max-w-2xl font-sans text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
            {pillar.summary}
          </span>
        </span>

        <span
          className={`flex h-14 w-16 items-center justify-end text-foreground transition-[opacity,transform] motion-reduce:transition-none sm:h-24 sm:w-32 lg:h-28 lg:w-40 ${
            isOpen
              ? "scale-[1.02] opacity-100 duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              : "scale-100 opacity-90 duration-[220ms] ease-[cubic-bezier(0.4,0,1,1)]"
          }`}
          aria-hidden="true"
        >
          <AnimatedVisual type={pillar.visual} />
        </span>

        <span
          className={`flex h-10 w-10 items-center justify-center border bg-background/55 text-foreground transition-[background-color,border-color,color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none group-hover:bg-foreground group-hover:text-background ${
            isOpen ? "border-[#0f60ec]/35 shadow-[0_10px_26px_rgba(18,30,82,0.08)]" : "border-foreground/10"
          }`}
        >
          <ChevronDown
            className={`h-5 w-5 transition-transform motion-reduce:transition-none ${
              isOpen
                ? "rotate-180 duration-[260ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                : "duration-[220ms] ease-[cubic-bezier(0.4,0,1,1)]"
            }`}
            aria-hidden="true"
          />
        </span>
      </button>

      <div
        id={contentId}
        className={`grid overflow-hidden transition-[grid-template-rows] motion-reduce:transition-none ${
          isOpen
            ? "grid-rows-[1fr] duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            : "grid-rows-[0fr] duration-[220ms] ease-[cubic-bezier(0.4,0,1,1)]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={`px-5 pb-6 transition-[opacity,transform] motion-reduce:transition-none sm:px-8 lg:pb-8 ${
              isOpen
                ? "translate-y-0 opacity-100 delay-75 duration-[240ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                : "translate-y-3 opacity-0 delay-0 duration-[180ms] ease-[cubic-bezier(0.4,0,1,1)]"
            }`}
          >
            <div className="border-t border-foreground/10 pt-6">
              <ul>
                {pillar.services.map((service) => (
                  <li
                    key={service.name}
                    className="grid grid-cols-[150px_minmax(0,1fr)] gap-5 border-b border-foreground/10 py-3.5 last:border-b-0"
                  >
                    <h3 className="font-sans text-[13px] font-medium leading-relaxed text-foreground/80 sm:text-sm">
                      {service.name}
                    </h3>
                    <p className="font-sans text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
                      {service.description}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex">
                <a
                  href={whatsappMessageUrl(`Hola, quiero consultar por ${pillar.title}`)}
                  target="_blank"
                  rel="noreferrer"
                  className={SERVICE_OUTLINE_CTA_CLASS}
                >
                  Consultar por {pillar.title}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [openPillar, setOpenPillar] = useState("");
  const sectionRef = useRef<HTMLDivElement>(null);
  const serviceRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollTimeoutRef = useRef<number | undefined>(undefined);
  const scrollFrameRef = useRef<number | undefined>(undefined);

  const clearPendingServiceScroll = useCallback(() => {
    if (scrollTimeoutRef.current !== undefined) {
      window.clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = undefined;
    }

    if (scrollFrameRef.current !== undefined) {
      window.cancelAnimationFrame(scrollFrameRef.current);
      scrollFrameRef.current = undefined;
    }
  }, []);

  const registerServiceRef = useCallback((number: string, node: HTMLDivElement | null) => {
    serviceRefs.current[number] = node;
  }, []);

  const scrollToServiceCard = useCallback((number: string) => {
    const el = serviceRefs.current[number];
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const headerRect = document.querySelector("header")?.getBoundingClientRect();
    const headerBottom =
      headerRect?.bottom ?? headerRect?.height ?? (window.innerWidth < 768 ? 88 : 96);
    const extraOffset = window.innerWidth < 768 ? 36 : 28;
    const offset = headerBottom + extraOffset;
    const rect = el.getBoundingClientRect();
    const comfortableMaxTop = Math.min(offset + 150, window.innerHeight * 0.38);
    const isComfortablyVisible = rect.top >= offset && rect.top <= comfortableMaxTop;

    if (isComfortablyVisible) return;

    window.scrollTo({
      top: Math.max(rect.top + window.scrollY - offset, 0),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, []);

  const scheduleServiceScroll = useCallback(
    (number: string) => {
      clearPendingServiceScroll();

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const delay = prefersReducedMotion ? 0 : SERVICE_SCROLL_DELAY_MS;

      scrollTimeoutRef.current = window.setTimeout(() => {
        scrollFrameRef.current = window.requestAnimationFrame(() => {
          scrollFrameRef.current = window.requestAnimationFrame(() => {
            scrollToServiceCard(number);
          });
        });
      }, delay);
    },
    [clearPendingServiceScroll, scrollToServiceCard]
  );

  const handlePillarToggle = useCallback(
    (number: string) => {
      const next = openPillar === number ? "" : number;

      setOpenPillar(next);

      if (next) {
        scheduleServiceScroll(next);
      } else {
        clearPendingServiceScroll();
      }
    },
    [clearPendingServiceScroll, openPillar, scheduleServiceScroll]
  );

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
    return () => clearPendingServiceScroll();
  }, [clearPendingServiceScroll]);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative py-24 lg:py-32"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            Servicios
          </span>
          <h2
            className={`text-4xl lg:text-6xl font-display tracking-tight transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Todo lo necesario.
            <br />
            <span className="text-muted-foreground">Nada de más.</span>
          </h2>
        </div>

        {/* Services List */}
        <div className="grid gap-4">
          {servicePillars.map((pillar, index) => (
            <ServicePillarCard
              key={pillar.number}
              pillar={pillar}
              index={index}
              isOpen={openPillar === pillar.number}
              onToggle={() => handlePillarToggle(pillar.number)}
              registerCardRef={registerServiceRef}
            />
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-5 text-center">
          <p className="font-display text-2xl tracking-tight text-foreground sm:text-3xl">
            ¿No estás seguro qué necesitás?
          </p>
          <a
            href={whatsappMessageUrl("Hola, quiero contarles sobre mi proyecto.")}
            target="_blank"
            rel="noopener noreferrer"
            className={OUTLINE_CTA_CLASS}
          >
            Contanos tu proyecto
          </a>
        </div>
      </div>
    </section>
  );
}
