"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

type VisualType = "deploy" | "ai" | "collab" | "security";

const servicePillars = [
  {
    number: "01",
    title: "Desarrollo web",
    summary: "Sitios y tiendas pensadas para presentar, vender y convertir con claridad.",
    visual: "deploy" as VisualType,
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
    visual: "collab" as VisualType,
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
    visual: "security" as VisualType,
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
    visual: "ai" as VisualType,
    services: [
      {
        name: "Marketing",
        description:
          "Impulsamos el crecimiento de tu marca con estrategias orientadas a resultados, combinando creatividad, análisis y publicidad digital para atraer clientes y aumentar conversiones.",
      },
    ],
  },
];

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

function SecurityVisual() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      {/* Shield */}
      <path
        d="M 100 20 L 150 40 L 150 90 Q 150 130 100 145 Q 50 130 50 90 L 50 40 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      
      {/* Inner shield */}
      <path
        d="M 100 35 L 135 50 L 135 85 Q 135 115 100 128 Q 65 115 65 85 L 65 50 Z"
        fill="currentColor"
        opacity="0.1"
      >
        <animate attributeName="opacity" values="0.1;0.2;0.1" dur="2s" repeatCount="indefinite" />
      </path>
      
      {/* Lock icon */}
      <rect x="85" y="70" width="30" height="25" rx="3" fill="currentColor" />
      <path
        d="M 90 70 L 90 60 Q 90 50 100 50 Q 110 50 110 60 L 110 70"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* Keyhole */}
      <circle cx="100" cy="80" r="4" fill="var(--background)" />
      <rect x="98" y="82" width="4" height="8" fill="var(--background)" />
      
      {/* Scan lines */}
      <line x1="60" y1="60" x2="140" y2="60" stroke="currentColor" strokeWidth="1" opacity="0">
        <animate attributeName="y1" values="40;120;40" dur="3s" repeatCount="indefinite" />
        <animate attributeName="y2" values="40;120;40" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.5;0" dur="3s" repeatCount="indefinite" />
      </line>
    </svg>
  );
}

function AnimatedVisual({ type }: { type: VisualType }) {
  switch (type) {
    case "deploy":
      return <DeployVisual />;
    case "ai":
      return <AIVisual />;
    case "collab":
      return <CollabVisual />;
    case "security":
      return <SecurityVisual />;
    default:
      return <DeployVisual />;
  }
}

function ServicePillarCard({
  pillar,
  index,
  isOpen,
  onToggle,
}: {
  pillar: typeof servicePillars[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentId = `service-pillar-${pillar.number}`;

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
      ref={cardRef}
      className={`group relative border border-foreground/10 bg-card/45 transition-[border-color,opacity,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-accent/40 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
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
          <span className="block text-2xl font-display leading-tight tracking-tight transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1 sm:text-3xl lg:text-4xl">
            {pillar.title}
          </span>
          <span className="mt-2 block max-w-2xl font-sans text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
            {pillar.summary}
          </span>
        </span>

        <span
          className="flex h-14 w-16 items-center justify-end text-foreground sm:h-24 sm:w-32 lg:h-28 lg:w-40"
          aria-hidden="true"
        >
          <AnimatedVisual type={pillar.visual} />
        </span>

        <span className="flex h-10 w-10 items-center justify-center border border-foreground/10 bg-background/55 text-foreground transition-colors duration-150 ease-out group-hover:bg-foreground group-hover:text-background">
          <ChevronDown
            className={`h-5 w-5 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] ${isOpen ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </span>
      </button>

      <div
        id={contentId}
        className={`grid overflow-hidden transition-[grid-template-rows] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 px-5 pb-6 sm:px-8 lg:pb-8">
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
              onToggle={() => setOpenPillar((current) => (current === pillar.number ? "" : pillar.number))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
