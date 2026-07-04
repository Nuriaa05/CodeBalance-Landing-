"use client";

import { siGmail, siInstagram, siWhatsapp, type SimpleIcon } from "simple-icons";
import { AnimatedWave } from "./animated-wave";
import { WHATSAPP_URL } from "./whatsapp";

const footerLinks = {
  CodeBalance: [
    { name: "Inicio", href: "#inicio" },
    { name: "Servicios", href: "#features" },
    { name: "Cómo trabajamos", href: "#how-it-works" },
    { name: "Casos de éxito", href: "#infraestructura" },
    { name: "Tecnologías", href: "#integrations" },
    { name: "Seguridad", href: "#security" },
    { name: "Nosotros", href: "#developers" },
    { name: "Testimonios", href: "#testimonios" },
    { name: "Contacto", href: "#contacto" },
  ],
};

const socialLinks = [
  { name: "Instagram", href: "https://www.instagram.com/codebalance_/", icon: siInstagram },
  { name: "WhatsApp", href: WHATSAPP_URL, icon: siWhatsapp },
  { name: "Gmail", href: "mailto:infocodebalance@gmail.com", icon: siGmail },
];

function SimpleIconLogo({ icon }: { icon: SimpleIcon }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path d={icon.path} fill="currentColor" />
    </svg>
  );
}

export function FooterSection() {
  return (
    <footer className="relative border-t border-foreground/10">
      {/* Animated wave background */}
      <div className="absolute inset-0 h-64 opacity-20 pointer-events-none overflow-hidden">
        <AnimatedWave />
      </div>
      
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Main Footer */}
        <div className="py-16 lg:py-24">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="col-span-2">
              <a href="#" className="inline-flex items-center gap-2 mb-6">
                <span className="text-2xl font-display">CodeBalance</span>
              </a>

              <p className="text-muted-foreground leading-relaxed mb-8 max-w-md">
                En CodeBalance ayudamos a emprendedores, profesionales y empresas a fortalecer su presencia digital y optimizar sus procesos mediante soluciones integrales de tecnología, marketing y finanzas.
              </p>

              {/* Social Links */}
              <div className="flex gap-6">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={link.name}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                  >
                    <SimpleIconLogo icon={link.icon} />
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-sm font-medium mb-6">{title}</h3>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            2026 CodeBalance. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
