export const COOKIE_CONSENT_KEY = "cookieConsent";
export const COOKIE_CONSENT_ACCEPTED_VALUE = "accepted";
export const COOKIE_BANNER_VISIBLE_EVENT = "codebalance-cookie-banner-visibility";

export type CookieBannerVisibilityDetail = {
  visible: boolean;
  height: number;
};

export function shouldShowCookieConsentBanner(consentValue: string | null) {
  return consentValue !== COOKIE_CONSENT_ACCEPTED_VALUE;
}

export function createCookieBannerVisibilityDetail(visible: boolean, height = 0) {
  return {
    visible,
    height: visible ? Math.max(0, height) : 0,
  };
}
