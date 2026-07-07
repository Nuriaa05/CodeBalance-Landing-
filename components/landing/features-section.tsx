"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { createWhatsAppUrl } from "./whatsapp";

type VisualType = "web" | "deploy" | "ai" | "collab" | "digital";

const OUTLINE_CTA_CLASS =
  "inline-flex shrink-0 items-center justify-center rounded-full border border-[#0f60ec] px-4 py-2 text-xs font-medium text-[#0f60ec] transition-colors duration-200 hover:bg-[#0f60ec] hover:text-white";
const SERVICE_OUTLINE_CTA_CLASS = `${OUTLINE_CTA_CLASS} max-md:active:border-[#0f60ec] max-md:active:bg-[rgba(15,96,236,0.08)] max-md:active:text-[#0f60ec]`;
const SERVICE_SCROLL_DELAY_MS = 420;

function whatsappMessageUrl(message: string) {
  return createWhatsAppUrl(message);
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
          "Transformamos los números en decisiones. Diseñamos estrategias que optimizan la rentabilidad, mejoran el control del negocio y permiten crecer con planificación y seguridad.\n\n" +
          "Ayudamos a empresas y emprendedores a ordenar sus finanzas para tomar decisiones con información real. Generación de herramientas de control, determinación de precios, presupuestos, análisis de rentabilidad, proyecciones financieras y planificación estratégica que impulsan un crecimiento sostenible.",
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
          "Impulsamos el crecimiento de tu marca mediante estrategias de marketing orientadas a resultados. Combinamos creatividad, análisis y publicidad digital para atraer clientes, fortalecer tu posicionamiento y aumentar las conversiones.",
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
    <svg viewBox="0 0 64 64" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        {`
          .pd-bar {
            transform-box: fill-box;
            transform-origin: center bottom;
            animation: pd-grow 2.4s ease-in-out infinite;
          }

          .pd-arrow {
            transform-box: fill-box;
            transform-origin: center;
            animation: pd-lift 2.4s ease-in-out infinite;
          }

          .pd-bar1 { animation-delay: 0s; }
          .pd-bar2 { animation-delay: .08s; }
          .pd-bar3 { animation-delay: .16s; }
          .pd-bar4 { animation-delay: .24s; }

          @keyframes pd-grow {
            0%, 15% {
              opacity: 0.24;
              transform: scaleY(0.32);
            }

            60%, 100% {
              opacity: 0.82;
              transform: scaleY(1);
            }
          }

          @keyframes pd-lift {
            0%, 15% {
              opacity: 0.28;
              transform: translate(-0.35px, 0.35px) scale(0.96);
            }

            60%, 100% {
              opacity: 0.72;
              transform: translate(0, 0) scale(1);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .pd-bar,
            .pd-arrow {
              animation: none;
            }

            .pd-bar,
            .pd-arrow {
              transform: none;
            }
          }
        `}
      </style>

      <g transform="translate(8 8) scale(3)">
        <path
          d="M 1 0.5 V 15.5 H 15.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.55"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.45"
        />

        {[
          { x: 3, y: 14, height: 1, delay: "0s" },
          { x: 6, y: 12, height: 3, delay: ".08s" },
          { x: 9, y: 9, height: 6, delay: ".16s" },
          { x: 12, y: 6, height: 9, delay: ".24s" },
        ].map((bar) => (
          <rect
            key={bar.x}
            className="pd-bar"
            x={bar.x}
            y={bar.y}
            width="2"
            height={bar.height}
            rx="0.5"
            fill="currentColor"
            opacity="0.28"
            style={{ animationDelay: bar.delay }}
          />
        ))}

        <path
          className="pd-arrow"
          d="M 2.146 11.854 A 0.5 0.5 0 0 1 2.146 11.146 L 12.293 1 H 10.5 A 0.5 0.5 0 0 1 10.5 0 H 13.5 A 0.5 0.5 0 0 1 14 0.5 V 3.5 A 0.5 0.5 0 0 1 13 3.5 V 1.707 L 2.854 11.854 A 0.5 0.5 0 0 1 2.146 11.854 Z"
          fill="currentColor"
          opacity="0.72"
        />
      </g>
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
  isOpen,
  onToggle,
  registerCardRef,
}: {
  pillar: typeof servicePillars[0];
  isOpen: boolean;
  onToggle: () => void;
  registerCardRef: (number: string, node: HTMLDivElement | null) => void;
}) {
  const [hasEntered, setHasEntered] = useState(false);
  const [entranceComplete, setEntranceComplete] = useState(false);
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
    const currentCard = cardRef.current;

    if (!currentCard) return;

    if (typeof IntersectionObserver === "undefined") {
      const frame = window.requestAnimationFrame(() => setHasEntered(true));
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setHasEntered(true);
        observer.unobserve(entry.target);
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.15,
      }
    );

    observer.observe(currentCard);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasEntered) return;

    const timeout = window.setTimeout(() => {
      setEntranceComplete(true);
    }, 560);

    return () => window.clearTimeout(timeout);
  }, [hasEntered]);

  return (
    <div
      ref={setCardNode}
      className={`group relative scroll-mt-[104px] border hover:border-accent/40 motion-safe:transition-[border-color,background-color,box-shadow,opacity,translate,transform] motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:transition-none md:scroll-mt-[120px] ${
        hasEntered ? "translate-x-0 opacity-100" : "-translate-x-6 opacity-0"
      } ${
        entranceComplete
          ? isOpen
            ? "motion-safe:duration-[400ms] motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)]"
            : "motion-safe:duration-[220ms] motion-safe:ease-[cubic-bezier(0.4,0,1,1)]"
          : "motion-safe:duration-[560ms] motion-safe:ease-out"
      } ${
        isOpen
          ? "border-[#0f60ec]/30 bg-card/60 shadow-[0_18px_55px_rgba(18,30,82,0.08)]"
          : "border-foreground/10 bg-card/45 shadow-none"
      }`}
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
                    <p className="whitespace-pre-line font-sans text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
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
  const [finalCtaHasEntered, setFinalCtaHasEntered] = useState(false);
  const [finalCtaEntranceComplete, setFinalCtaEntranceComplete] = useState(false);
  const [openPillar, setOpenPillar] = useState("");
  const sectionRef = useRef<HTMLDivElement>(null);
  const finalCtaRef = useRef<HTMLDivElement>(null);
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
    const finalCta = finalCtaRef.current;

    if (!finalCta) return;

    if (typeof IntersectionObserver === "undefined") {
      const frame = window.requestAnimationFrame(() => setFinalCtaHasEntered(true));
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setFinalCtaHasEntered(true);
        observer.unobserve(entry.target);
      },
      {
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    observer.observe(finalCta);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!finalCtaHasEntered) return;

    const timeout = window.setTimeout(() => {
      setFinalCtaEntranceComplete(true);
    }, 700);

    return () => window.clearTimeout(timeout);
  }, [finalCtaHasEntered]);

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
            Todo lo que tu negocio necesita.
            <br />
            <span className="text-muted-foreground">En un solo lugar.</span>
          </h2>
        </div>

        {/* Services List */}
        <div className="grid gap-4">
          {servicePillars.map((pillar) => (
            <ServicePillarCard
              key={pillar.number}
              pillar={pillar}
              isOpen={openPillar === pillar.number}
              onToggle={() => handlePillarToggle(pillar.number)}
              registerCardRef={registerServiceRef}
            />
          ))}
        </div>

        <div ref={finalCtaRef} className="mt-12 flex flex-col items-center gap-5 text-center">
          <p
            className={`font-display text-2xl tracking-tight text-foreground motion-safe:transition-[opacity,translate] motion-safe:duration-500 motion-safe:ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 sm:text-3xl ${
              finalCtaHasEntered ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            }`}
          >
            ¿No estás seguro qué necesitás?
          </p>
          <a
            href={whatsappMessageUrl("Hola, quiero contarles sobre mi proyecto.")}
            target="_blank"
            rel="noopener noreferrer"
            className={`${OUTLINE_CTA_CLASS} motion-safe:transition-[background-color,border-color,color,opacity,translate] motion-safe:ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
              finalCtaHasEntered ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            } ${
              finalCtaHasEntered && !finalCtaEntranceComplete ? "motion-safe:delay-200" : "motion-safe:delay-0"
            } ${
              finalCtaEntranceComplete ? "motion-safe:duration-200" : "motion-safe:duration-500"
            }`}
          >
            Contanos tu proyecto
          </a>
        </div>
      </div>
    </section>
  );
}
