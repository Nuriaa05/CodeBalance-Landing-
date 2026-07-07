"use client";

import { useEffect, useState, useRef } from "react";
import {
  siAstro,
  siDocker,
  siExpo,
  siExpress,
  siGit,
  siGithub,
  siJest,
  siMysql,
  siNestjs,
  siNodedotjs,
  siPostgresql,
  siPrisma,
  siRadixui,
  siReact,
  siRedis,
  siSequelize,
  siSocketdotio,
  siSqlite,
  siSwagger,
  siTailwindcss,
  siTypeorm,
  siTypescript,
  siVercel,
  siVite,
  siVitest,
  type SimpleIcon,
} from "simple-icons";

type Technology = {
  name: string;
  category: string;
  icon?: SimpleIcon;
  customIcon?: "mobile" | "rest";
};

const technologyRows: Technology[][] = [
  [
    { name: "React", category: "Frontend", icon: siReact },
    { name: "Vite", category: "Frontend", icon: siVite },
    { name: "TypeScript", category: "Frontend", icon: siTypescript },
    { name: "Tailwind CSS", category: "Frontend", icon: siTailwindcss },
    { name: "Astro", category: "Frontend", icon: siAstro },
    { name: "Radix UI", category: "Frontend", icon: siRadixui },
    { name: "Node.js", category: "Backend", icon: siNodedotjs },
    { name: "Express", category: "Backend", icon: siExpress },
    { name: "NestJS", category: "Backend", icon: siNestjs },
    { name: "APIs REST", category: "Backend", customIcon: "rest" },
    { name: "Socket.io", category: "Backend", icon: siSocketdotio },
    { name: "Swagger", category: "Backend", icon: siSwagger },
    { name: "Mobile", category: "Apps", customIcon: "mobile" },
    { name: "React Native", category: "Mobile", icon: siReact },
    { name: "Expo", category: "Mobile", icon: siExpo },
  ],
  [
    { name: "PostgreSQL", category: "Datos", icon: siPostgresql },
    { name: "MySQL", category: "Datos", icon: siMysql },
    { name: "SQLite", category: "Datos", icon: siSqlite },
    { name: "Redis", category: "Datos", icon: siRedis },
    { name: "Prisma", category: "Datos", icon: siPrisma },
    { name: "TypeORM", category: "Datos", icon: siTypeorm },
    { name: "Sequelize", category: "Datos", icon: siSequelize },
    { name: "Vitest", category: "Testing", icon: siVitest },
    { name: "Jest", category: "Testing", icon: siJest },
    { name: "Git", category: "Herramientas", icon: siGit },
    { name: "GitHub", category: "Herramientas", icon: siGithub },
    { name: "Docker", category: "Herramientas", icon: siDocker },
    { name: "Vercel", category: "Herramientas", icon: siVercel },
  ],
];

function SimpleIconLogo({ icon }: { icon: SimpleIcon }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
      <path d={icon.path} fill="currentColor" />
    </svg>
  );
}

function RestApiLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
      <path d="M7 7.5h10M7 16.5h10M8 8l4 4-4 4M16 8l-4 4 4 4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="4.5" cy="7.5" r="1.6" fill="currentColor" />
      <circle cx="19.5" cy="16.5" r="1.6" fill="currentColor" />
    </svg>
  );
}

function MobileLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
      <rect x="7.5" y="3" width="9" height="18" rx="2.4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10.5 6h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="17.5" r="1" fill="currentColor" />
    </svg>
  );
}

function TechnologyLogo({ technology }: { technology: Technology }) {
  if (technology.icon) {
    return <SimpleIconLogo icon={technology.icon} />;
  }

  if (technology.customIcon === "mobile") {
    return <MobileLogo />;
  }

  return <RestApiLogo />;
}

function TechnologyCard({ technology, setIndex }: { technology: Technology; setIndex: number }) {
  return (
    <div
      data-tech={technology.name}
      className="group flex min-w-[230px] shrink-0 items-center gap-4 border border-foreground/10 bg-card/45 px-5 py-4 transition-[background-color,border-color,transform] duration-300 ease-out hover:-translate-y-0.5 hover:border-accent/45 hover:bg-card/80"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-foreground/10 bg-background/55 text-foreground transition-colors duration-300 group-hover:text-accent">
        <TechnologyLogo technology={technology} />
      </div>
      <div className="min-w-0">
        <div className="truncate text-base font-medium">{technology.name}</div>
        <div className="mt-1 text-xs font-mono text-muted-foreground">{technology.category}</div>
      </div>
      <span className="sr-only">carousel set {setIndex + 1}</span>
    </div>
  );
}

function TechnologyRow({ technologies, reverse = false }: { technologies: Technology[]; reverse?: boolean }) {
  return (
    <div className={`flex w-max ${reverse ? "marquee-reverse" : "marquee"}`}>
      {[...Array(2)].map((_, setIndex) => (
        <div key={setIndex} className="flex shrink-0 gap-5 pr-5" aria-hidden={setIndex > 0}>
          {technologies.map((technology) => (
            <TechnologyCard key={`${technology.name}-${setIndex}`} technology={technology} setIndex={setIndex} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function IntegrationsSection() {
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
    <section id="integrations" ref={sectionRef} className="relative overflow-hidden bg-[#ffffff] py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 lg:mb-24 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            Tecnologías
            <span className="w-8 h-px bg-foreground/30" />
          </span>
          <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-6">
            La tecnología correcta
            <br />
            Para cada proyecto
          </h2>
          <p className="text-xl text-muted-foreground">
            Elegimos el stack que mejor se adapta a cada uno, priorizando rendimiento y escalabilidad.
          </p>
        </div>

      </div>
      
      {/* Full-width marquees outside container */}
      <div className="w-full mb-5">
        <TechnologyRow technologies={technologyRows[0]} />
      </div>
      
      {/* Reverse marquee */}
      <div className="w-full">
        <TechnologyRow technologies={technologyRows[1]} reverse />
      </div>
    </section>
  );
}
