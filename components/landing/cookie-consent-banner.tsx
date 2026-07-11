"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import {
  COOKIE_BANNER_VISIBLE_EVENT,
  COOKIE_CONSENT_ACCEPTED_VALUE,
  COOKIE_CONSENT_KEY,
  createCookieBannerVisibilityDetail,
  shouldShowCookieConsentBanner,
  type CookieBannerVisibilityDetail,
} from "@/lib/cookie-consent";
import {
  COOKIE_BANNER_ACTION_CLASS_NAME,
  COOKIE_BANNER_CONTAINER_CLASS_NAME,
  COOKIE_BANNER_CONTENT_CLASS_NAME,
  COOKIE_BANNER_HIDDEN_CLASS_NAME,
  COOKIE_BANNER_TEXT_CLASS_NAME,
  COOKIE_BANNER_VISIBLE_CLASS_NAME,
} from "@/lib/cookie-banner-layout";

type CookieConsentBannerProps = {
  metaPixelId?: string;
};

function setCookieBannerVisibility(visible: boolean, height = 0) {
  const detail = createCookieBannerVisibilityDetail(visible, height);

  document.body.dataset.cookieBannerVisible = visible ? "true" : "false";
  document.body.dataset.cookieBannerHeight = String(detail.height);
  window.dispatchEvent(
    new CustomEvent<CookieBannerVisibilityDetail>(COOKIE_BANNER_VISIBLE_EVENT, {
      detail,
    })
  );
}

export function CookieConsentBanner({ metaPixelId }: CookieConsentBannerProps) {
  const [hasAccepted, setHasAccepted] = useState(false);
  const [shouldRenderBanner, setShouldRenderBanner] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const showTimeoutRef = useRef<number | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);
  const acceptedFrameRef = useRef<number | null>(null);
  const showFrameRef = useRef<number | null>(null);
  const bannerRef = useRef<HTMLDivElement | null>(null);
  const pixelId = metaPixelId ? JSON.stringify(metaPixelId) : null;

  const getBannerHeight = () => bannerRef.current?.getBoundingClientRect().height ?? 0;

  useEffect(() => {
    const cleanupTimers = () => {
      if (acceptedFrameRef.current !== null) {
        window.cancelAnimationFrame(acceptedFrameRef.current);
      }

      if (showFrameRef.current !== null) {
        window.cancelAnimationFrame(showFrameRef.current);
      }

      if (showTimeoutRef.current !== null) {
        window.clearTimeout(showTimeoutRef.current);
      }

      if (hideTimeoutRef.current !== null) {
        window.clearTimeout(hideTimeoutRef.current);
      }

      setCookieBannerVisibility(false, 0);
    };

    const storedConsent = window.localStorage.getItem(COOKIE_CONSENT_KEY);

    if (!shouldShowCookieConsentBanner(storedConsent)) {
      setCookieBannerVisibility(false, 0);
      acceptedFrameRef.current = window.requestAnimationFrame(() => {
        setHasAccepted(true);
      });
      return cleanupTimers;
    }

    showTimeoutRef.current = window.setTimeout(() => {
      setShouldRenderBanner(true);
      showFrameRef.current = window.requestAnimationFrame(() => {
        setIsBannerVisible(true);
        setCookieBannerVisibility(true, getBannerHeight());
      });
    }, 800);

    return cleanupTimers;
  }, []);

  useEffect(() => {
    if (!shouldRenderBanner || !isBannerVisible) return;

    let frameId: number | null = null;

    const updateMeasuredHeight = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        setCookieBannerVisibility(true, getBannerHeight());
        frameId = null;
      });
    };

    updateMeasuredHeight();
    window.addEventListener("resize", updateMeasuredHeight);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("resize", updateMeasuredHeight);
    };
  }, [shouldRenderBanner, isBannerVisible]);

  const handleAccept = () => {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, COOKIE_CONSENT_ACCEPTED_VALUE);
    setHasAccepted(true);
    setIsBannerVisible(false);
    setCookieBannerVisibility(false, 0);

    hideTimeoutRef.current = window.setTimeout(() => {
      setShouldRenderBanner(false);
    }, 300);
  };

  return (
    <>
      {hasAccepted && pixelId && (
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
            fbq('set', 'autoConfig', false, ${pixelId});
            fbq('init', ${pixelId});
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {shouldRenderBanner && (
        <div
          ref={bannerRef}
          role="region"
          aria-label="Aviso de cookies"
          className={`${COOKIE_BANNER_CONTAINER_CLASS_NAME} ${
            isBannerVisible ? COOKIE_BANNER_VISIBLE_CLASS_NAME : COOKIE_BANNER_HIDDEN_CLASS_NAME
          }`}
        >
          <div className={COOKIE_BANNER_CONTENT_CLASS_NAME}>
            <p className={COOKIE_BANNER_TEXT_CLASS_NAME}>
              <span>
                Al navegar por este sitio{" "}
                <strong className="font-bold">acept&aacute;s el uso de cookies</strong>
              </span>
              <span> para mejorar tu experiencia.</span>
            </p>
            <button
              type="button"
              onClick={handleAccept}
              className={COOKIE_BANNER_ACTION_CLASS_NAME}
            >
              ENTENDIDO
            </button>
          </div>
        </div>
      )}
    </>
  );
}
