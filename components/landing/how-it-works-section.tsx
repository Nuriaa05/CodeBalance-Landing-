"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    number: "I",
    title: "Diagnóstico y estrategia",
    description:
      "Analizamos tu negocio, tus objetivos y a quién le hablás, para definir el camino más directo entre lo que tenés hoy y lo que necesitás lograr.",
    fileName: "diagnostico.ts",
    status: "Relevamiento listo",
    code: `import { CodeBalance } from '@codebalance/core'

CodeBalance.analizar({
  objetivo: 'definir-alcance',
  publico: 'tu-cliente-ideal',
  stack: 'a-evaluar'
})

// Relevamiento completo`,
  },
  {
    number: "II",
    title: "Diseño y desarrollo",
    description:
      "Construimos la solución a medida — sitio, sistema, automatización o estrategia financiera — con foco en que funcione, no solo en que se vea bien.",
    fileName: "desarrollo.ts",
    status: "Compilando",
    code: `CodeBalance.construir('solucion', {
  diseño: 'a-medida',
  entregables: [
    'ui/ux',
    'frontend',
    'backend'
  ]
})

// 3 de 3 entregables en curso`,
  },
  {
    number: "III",
    title: "Lanzamiento y acompañamiento",
    description:
      'Publicamos, medimos resultados y ajustamos. El trabajo no termina en el "listo": seguimos optimizando para que siga dando resultado.',
    fileName: "lanzamiento.ts",
    status: "En producción",
    code: `CodeBalance.lanzar({
  entorno: 'produccion',
  monitoreo: 'activo',
  ajustes: 'continuo'
})

// Publicado y en seguimiento`,
  },
];

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const currentStep = steps[activeStep];

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
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-foreground text-background overflow-hidden"
    >
      {/* Diagonal lines pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 40px,
            currentColor 40px,
            currentColor 41px
          )`
        }} />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-background/50 mb-6">
            <span className="w-8 h-px bg-background/30" />
            Cómo trabajamos
          </span>
          <h2
            className={`text-4xl lg:text-6xl font-display tracking-tight transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Tres pasos.
            <br />
            <span className="text-background/50">Resultados a medida.</span>
          </h2>
        </div>

        {/* Main content */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-24">
          {/* Steps */}
          <div className="w-full space-y-0">
            {steps.map((step, index) => (
              <button
                key={step.number}
                type="button"
                onClick={() => setActiveStep(index)}
                className={`w-full border-b border-background/10 py-6 text-left transition-all duration-500 group lg:py-8 ${
                  activeStep === index ? "opacity-100" : "opacity-75 hover:opacity-90 lg:opacity-40 lg:hover:opacity-70"
                }`}
              >
                <div className="flex items-start gap-4 sm:gap-6">
                  <span className="font-display text-3xl text-background/30">{step.number}</span>
                  <div className="flex-1">
                    <h3 className="mb-2 font-display text-2xl transition-transform duration-300 group-hover:translate-x-2 lg:mb-3 lg:text-3xl">
                      {step.title}
                    </h3>
                    <p className="text-background/60 leading-relaxed">
                      {step.description}
                    </p>
                    
                    {/* Progress indicator */}
                    {activeStep === index && (
                      <div className="mt-4 h-px bg-background/20 overflow-hidden">
                        <div 
                          className="h-full bg-[#0f60ec] w-0"
                          style={{
                            animation: 'progress 5s linear forwards'
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Code display */}
          <div className="hidden self-start lg:sticky lg:top-32 lg:block">
            <div className="border border-background/10 overflow-hidden">
              {/* Window header */}
              <div className="px-6 py-4 border-b border-background/10 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-background/20" />
                  <div className="w-3 h-3 rounded-full bg-background/20" />
                  <div className="w-3 h-3 rounded-full bg-background/20" />
                </div>
                <span className="text-xs font-mono text-background/40">{currentStep.fileName}</span>
              </div>

              {/* Code content */}
              <div className="p-8 font-mono text-sm min-h-[280px]">
                <pre className="text-background/70">
                  {currentStep.code.split('\n').map((line, lineIndex) => (
                    <div 
                      key={`${activeStep}-${lineIndex}`} 
                      className="leading-loose code-line-reveal"
                      style={{ 
                        animationDelay: `${lineIndex * 80}ms`,
                      }}
                    >
                      <span className="text-background/20 select-none w-8 inline-block">{lineIndex + 1}</span>
                      <span className="inline-flex">
                        {line.split('').map((char, charIndex) => (
                          <span
                            key={`${activeStep}-${lineIndex}-${charIndex}`}
                            className="code-char-reveal"
                            style={{
                              animationDelay: `${lineIndex * 80 + charIndex * 15}ms`,
                            }}
                          >
                            {char === ' ' ? '\u00A0' : char}
                          </span>
                        ))}
                      </span>
                    </div>
                  ))}
                </pre>
              </div>

              {/* Status */}
              <div className="px-6 py-4 border-t border-background/10 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-mono text-background/40">{currentStep.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        
        .code-line-reveal {
          opacity: 0;
          transform: translateX(-8px);
          animation: lineReveal 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        
        @keyframes lineReveal {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .code-char-reveal {
          opacity: 0;
          filter: blur(8px);
          animation: charReveal 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        
        @keyframes charReveal {
          to {
            opacity: 1;
            filter: blur(0);
          }
        }
      `}</style>
    </section>
  );
}
