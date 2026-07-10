"use client";

import { useEffect, useState } from "react";

const testimonials = [
  // TODO: pendiente de confirmación del cliente
  {
    quote: "Con CodeBalance mejoramos muchísimo nuestra presencia digital. Se nota en cómo nos encuentran los clientes ahora.",
    author: "Gustavo González",
    role: "Dueño",
    company: "Neutron Tecnología SAS",
    avatar: "G",
    metric: "Mayor presencia digital",
  },
  // TODO: pendiente de confirmación del cliente
  {
    quote: "La web transmite exactamente la seriedad que buscaba para mi consultorio",
    author: "Dr. Masedo Carlos Dante",
    role: "Cirujano",
    company: "Dr. Masedo Carlos Dante",
    avatar: "M",
    metric: "Más consultas agendadas desde la web",
  },
  // TODO: pendiente de confirmación del cliente
  {
    quote: "El sistema nos simplificó la gestión de stock. Lo que antes llevaba varios pasos, ahora es mucho más directo.",
    author: "Johanna Gomez",
    role: "Sistema de stock",
    company: "",
    avatar: "J",
    metric: "Gestión de stock más ágil",
  },
  // TODO: pendiente de confirmación del cliente
  {
    quote: "Nos entendieron perfecto lo que necesitábamos para el día a día del local. El sistema nos hizo la vida mucho más simple.",
    author: "Ivonne Vignudo",
    role: "Dueña",
    company: "Lozano Congelados",
    avatar: "I",
    metric: "Menos tiempo perdido en tareas manuales",
  },
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
        setIsAnimating(false);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section id="testimonios" className="relative border-t border-foreground/10 bg-[#f4f6fa] py-32 lg:py-40 lg:pb-14">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Label */}
        <div className="flex items-center gap-4 mb-16">
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Lo que dicen los equipos
          </span>
          <div className="flex-1 h-px bg-foreground/10" />
          <span className="font-mono text-xs text-muted-foreground">
            {String(activeIndex + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
          </span>
        </div>

        {/* Main Quote */}
        <div className="grid items-stretch gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="flex flex-col lg:col-span-8">
            <blockquote
              className={`flex h-[340px] items-start transition-all duration-300 sm:h-[300px] md:h-[280px] lg:h-[340px] xl:h-[280px] ${
                isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
              }`}
            >
              <p className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight text-foreground">
                &ldquo;{activeTestimonial.quote}&rdquo;
              </p>
            </blockquote>

            {/* Author */}
            <div
              className={`mt-12 flex min-h-24 items-center gap-6 transition-all duration-300 delay-100 ${
                isAnimating ? "opacity-0" : "opacity-100"
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-card/70 border border-foreground/10 flex items-center justify-center">
                <span className="font-display text-2xl text-foreground">
                  {activeTestimonial.avatar}
                </span>
              </div>
              <div>
                <p className="text-lg font-medium text-foreground">{activeTestimonial.author}</p>
                <p className="text-muted-foreground">
                  {activeTestimonial.company
                    ? `${activeTestimonial.role}, ${activeTestimonial.company}`
                    : activeTestimonial.role}
                </p>
              </div>
            </div>
          </div>

          {/* Metric Highlight */}
          <div className="flex flex-col justify-center lg:col-span-4">
            <div
              className={`flex h-[180px] flex-col justify-center border border-foreground/10 bg-card/55 p-8 transition-all duration-300 md:h-[190px] lg:h-[220px] ${
                isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
            >
              <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase block mb-4">
                Resultado clave
              </span>
              <p className="font-display text-3xl md:text-4xl text-foreground">
                {activeTestimonial.metric}
              </p>
            </div>

            {/* Navigation Dots */}
            <div className="flex gap-2 mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  aria-label={`Ver testimonio ${idx + 1} de ${testimonials.length}`}
                  aria-current={idx === activeIndex}
                  onClick={() => {
                    setIsAnimating(true);
                    setTimeout(() => {
                      setActiveIndex(idx);
                      setIsAnimating(false);
                    }, 300);
                  }}
                  className={`h-2 transition-all duration-300 ${
                    idx === activeIndex
                      ? "w-8 bg-[#0f60ec]"
                      : "w-2 bg-foreground/20 hover:bg-foreground/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
