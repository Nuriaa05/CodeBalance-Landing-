"use client";

import { useEffect, useState, useRef } from "react";
import { Shield, Lock, Eye, FileCheck } from "lucide-react";

const securityFeatures = [
  {
    icon: Shield,
    title: "Hosting confiable",
    description: "Desplegamos en plataformas reconocidas con HTTPS por defecto y monitoreo de disponibilidad.",
  },
  {
    icon: Lock,
    title: "Buenas prácticas de desarrollo",
    description: "Manejo seguro de credenciales y variables de entorno, control de versiones y revisión de código en cada entrega.",
  },
  {
    icon: Eye,
    title: "Confidencialidad",
    description: "Cuando el proyecto lo requiere, firmamos acuerdo de confidencialidad (NDA). La información de tu negocio y tus clientes no se comparte con terceros.",
  },
  {
    icon: FileCheck,
    title: "Cumplimiento con la normativa argentina",
    description: "Diseñamos formularios y bases de datos respetando la Ley de Protección de Datos Personales (25.326).",
  },
];

const certifications = ["HTTPS", "Ley 25.326", "Backups", "Confidencialidad"];

export function SecuritySection() {
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
    <section id="security" ref={sectionRef} className="relative overflow-hidden bg-[#f4f6fa] py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: Content */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              Seguridad
            </span>
            <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-8">
              La confianza es
              <br />
              innegociable.
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              Respeto por la información de tu negocio y tus clientes en cada proyecto que entregamos.
            </p>

            {/* Certifications */}
            <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:gap-3">
              {certifications.map((cert, index) => (
                <span
                  key={cert}
                  className={`px-4 py-2 border border-foreground/10 bg-background/55 text-sm font-mono transition-all duration-500 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${index * 50 + 200}ms` }}
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Features */}
          <div className="grid gap-6">
            {securityFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className={`border border-l-[3px] border-foreground/10 border-l-[#0f60ec] bg-background/45 px-6 py-5 transition-all duration-500 hover:border-accent/40 hover:border-l-[#0f60ec] group sm:p-6 lg:border-l lg:border-l-foreground/10 lg:hover:border-l-accent/40 ${
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 flex items-center justify-center border border-foreground/10 group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1 group-hover:translate-x-1 transition-transform duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
