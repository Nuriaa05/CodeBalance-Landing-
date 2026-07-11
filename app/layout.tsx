import React from "react"
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'

const siteTitle = 'CodeBalance — Agencia de desarrollo, marketing y finanzas'
const siteDescription =
  'CodeBalance combina desarrollo web, marketing y estrategia financiera para ayudar a empresas y emprendedores a crecer en el mundo digital.'
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')
const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-64x64.png', sizes: '64x64', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  openGraph: {
    url: '/',
    title: siteTitle,
    description: siteDescription,
    siteName: 'CodeBalance',
    locale: 'es_AR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1600,
        height: 630,
        alt: 'CodeBalance',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: '/og-image.png',
        alt: 'CodeBalance',
      },
    ],
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'CodeBalance',
  description: siteDescription,
  url: siteUrl,
  logo: `${siteUrl}/icon-64x64.png`,
  telephone: '+54 9 362 533 5330',
  sameAs: [
    'https://www.instagram.com/codebalance_/',
    'https://wa.me/5493625335330',
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        {metaPixelId && (
          <>
            <Script id="meta-pixel" strategy="afterInteractive">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('set', 'autoConfig', false, '${metaPixelId}');
                fbq('init', '${metaPixelId}');
                fbq('track', 'PageView');
              `}
            </Script>
            <noscript
              dangerouslySetInnerHTML={{
                __html: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1" alt="" />`,
              }}
            />
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
