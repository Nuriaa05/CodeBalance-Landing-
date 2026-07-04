"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { siWhatsapp, type SimpleIcon } from "simple-icons";

const WHATSAPP_URL = "https://wa.me/5493625335330";

const navLinks = [
  { name: "Inicio", href: "#inicio" },
  { name: "Servicios", href: "#features" },
  { name: "Cómo trabajamos", href: "#how-it-works" },
  { name: "Casos de éxito", href: "#infraestructura" },
  { name: "Tecnologías", href: "#integrations" },
  { name: "Seguridad", href: "#security" },
  { name: "Nosotros", href: "#developers" },
  { name: "Testimonios", href: "#testimonios" },
  { name: "Contacto", href: "#contacto" },
];

function SimpleIconLogo({ icon }: { icon: SimpleIcon }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path d={icon.path} fill="currentColor" />
    </svg>
  );
}

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState(navLinks[0].href);
  const lockedHrefRef = useRef<string | null>(null);

  const activateLink = (href: string) => {
    lockedHrefRef.current = href;
    setActiveHref(href);
  };

  useEffect(() => {
    let frameId: number | null = null;

    const updateNavigationState = () => {
      setIsScrolled(window.scrollY > 20);

      if (lockedHrefRef.current) {
        const lockedSection = document.getElementById(lockedHrefRef.current.slice(1));
        const isAtDocumentEnd =
          window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
        const isLockedSectionReached =
          !lockedSection || Math.abs(lockedSection.getBoundingClientRect().top) <= 120;

        if (isLockedSectionReached || isAtDocumentEnd) {
          lockedHrefRef.current = null;
        } else {
          setActiveHref(lockedHrefRef.current);
          return;
        }
      }

      const marker = window.scrollY + Math.min(window.innerHeight * 0.35, 320);
      let currentHref = navLinks[0].href;

      for (const link of navLinks) {
        const section = document.getElementById(link.href.slice(1));
        if (section && section.offsetTop <= marker) {
          currentHref = link.href;
        }
      }

      setActiveHref(currentHref);
    };

    const handleScroll = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(() => {
        updateNavigationState();
        frameId = null;
      });
    };

    const handleHashChange = () => {
      const matchingLink = navLinks.find((link) => link.href === window.location.hash);
      if (matchingLink) {
        lockedHrefRef.current = matchingLink.href;
        setActiveHref(matchingLink.href);
      }
    };

    updateNavigationState();
    handleHashChange();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  return (
    <header
      className={`fixed z-50 transition-all duration-500 ${
        isScrolled 
          ? "top-4 left-4 right-4" 
          : "top-0 left-0 right-0"
      }`}
    >
      <nav
        className={`mx-auto transition-all duration-500 ${
          isScrolled || isMobileMenuOpen
            ? "relative z-50 bg-card/80 backdrop-blur-xl border border-foreground/10 rounded-2xl shadow-[0_18px_50px_rgba(18,30,82,0.10)] max-w-[1200px]"
            : "relative z-50 bg-transparent max-w-[1400px]"
        }`}
      >
        <div 
          className={`flex items-center justify-between transition-all duration-500 px-6 lg:px-8 ${
            isScrolled ? "h-14" : "h-20"
          }`}
        >
          {/* Logo */}
          <a href="#inicio" onClick={() => activateLink("#inicio")} className="flex items-center gap-2 group">
            <span className={`font-display tracking-tight transition-all duration-500 ${isScrolled ? "text-xl" : "text-2xl"}`}>
              <span style={{ color: "#555865" }}>Code</span>
              <span style={{ color: "#0f60ec" }}>Balance</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-4 2xl:gap-5">
            {navLinks.map((link) => {
              const isActive = activeHref === link.href;

              return (
                <a
                  key={link.name}
                  href={link.href}
                  aria-current={isActive ? "location" : undefined}
                  onClick={() => activateLink(link.href)}
                  className={`text-xs 2xl:text-sm transition-colors duration-300 relative group whitespace-nowrap ${
                    isActive ? "text-foreground" : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-[#0f60ec] transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </a>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden xl:flex items-center gap-4">
            <Button
              asChild
              size="sm"
              className={`bg-[#0f60ec] hover:bg-[#0f60ec] text-white rounded-full transition-all duration-500 ${isScrolled ? "px-4 h-8 text-xs" : "px-6"}`}
            >
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                <SimpleIconLogo icon={siWhatsapp} />
                Contactanos
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2 transition-transform duration-150 ease-out active:scale-95"
            aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            type="button"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>

      </nav>
      
      {/* Mobile Menu - Full Screen Overlay */}
      <div
        id="mobile-navigation"
        aria-hidden={!isMobileMenuOpen}
        inert={!isMobileMenuOpen}
        className={`xl:hidden fixed inset-0 bg-background z-40 transition-all duration-500 ${
          isMobileMenuOpen 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        }`}
        style={{ top: 0 }}
      >
        <div className="flex flex-col h-full px-8 pt-28 pb-8">
          {/* Navigation Links */}
          <div className="flex-1 flex flex-col justify-center gap-3 sm:gap-3.5">
            {navLinks.map((link, i) => {
              const isActive = activeHref === link.href;

              return (
                <a
                  key={link.name}
                  href={link.href}
                  aria-current={isActive ? "location" : undefined}
                  onClick={() => {
                    activateLink(link.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`font-sans text-[23px] font-medium leading-tight transition-all duration-500 sm:text-2xl ${
                    isActive ? "text-[#0f60ec]" : "text-foreground/60 hover:text-foreground/80"
                  } ${
                    isMobileMenuOpen
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: isMobileMenuOpen ? `${i * 75}ms` : "0ms" }}
                >
                  {link.name}
                </a>
              );
            })}
          </div>
          
          {/* Bottom CTAs */}
          <div className={`flex gap-4 pt-8 border-t border-foreground/10 transition-all duration-500 ${
            isMobileMenuOpen 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: isMobileMenuOpen ? "300ms" : "0ms" }}
          >
            <Button 
              asChild
              className="flex-1 bg-[#0f60ec] text-white rounded-full h-14 text-base"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                <SimpleIconLogo icon={siWhatsapp} />
                Contactanos
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
