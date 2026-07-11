import assert from "node:assert/strict";
import { test } from "node:test";
import {
  COOKIE_CONSENT_ACCEPTED_VALUE,
  COOKIE_CONSENT_KEY,
  COOKIE_BANNER_VISIBLE_EVENT,
  createCookieBannerVisibilityDetail,
  shouldShowCookieConsentBanner,
} from "./cookie-consent.ts";

test("cookie consent constants use stable storage and event keys", () => {
  assert.equal(COOKIE_CONSENT_KEY, "cookieConsent");
  assert.equal(COOKIE_CONSENT_ACCEPTED_VALUE, "accepted");
  assert.equal(COOKIE_BANNER_VISIBLE_EVENT, "codebalance-cookie-banner-visibility");
});

test("shouldShowCookieConsentBanner hides the banner after consent is accepted", () => {
  assert.equal(shouldShowCookieConsentBanner("accepted"), false);
});

test("shouldShowCookieConsentBanner shows the banner when consent is missing or different", () => {
  assert.equal(shouldShowCookieConsentBanner(null), true);
  assert.equal(shouldShowCookieConsentBanner(""), true);
  assert.equal(shouldShowCookieConsentBanner("dismissed"), true);
});

test("createCookieBannerVisibilityDetail includes the measured banner height", () => {
  assert.deepEqual(createCookieBannerVisibilityDetail(true, 92), {
    visible: true,
    height: 92,
  });
});
