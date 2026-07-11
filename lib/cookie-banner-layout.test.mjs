import assert from "node:assert/strict";
import { test } from "node:test";
import {
  COOKIE_BANNER_CONTAINER_CLASS_NAME,
  COOKIE_BANNER_CONTENT_CLASS_NAME,
} from "./cookie-banner-layout.ts";

test("cookie banner container is centered and uses 60vw on larger screens", () => {
  assert.match(COOKIE_BANNER_CONTAINER_CLASS_NAME, /left-1\/2/);
  assert.match(COOKIE_BANNER_CONTAINER_CLASS_NAME, /-translate-x-1\/2/);
  assert.match(COOKIE_BANNER_CONTAINER_CLASS_NAME, /w-\[60vw\]/);
  assert.match(COOKIE_BANNER_CONTAINER_CLASS_NAME, /max-md:w-\[calc\(100vw-2rem\)\]/);
});

test("cookie banner container has a visibly opaque background treatment", () => {
  assert.match(COOKIE_BANNER_CONTAINER_CLASS_NAME, /bg-\[#0a1a3d\]\/95/);
  assert.match(COOKIE_BANNER_CONTAINER_CLASS_NAME, /shadow-\[0_24px_80px_rgba\(5,12,32,0\.32\)\]/);
});

test("cookie banner content can fall into columns when space is tight", () => {
  assert.match(COOKIE_BANNER_CONTENT_CLASS_NAME, /grid/);
  assert.match(COOKIE_BANNER_CONTENT_CLASS_NAME, /grid-cols-1/);
  assert.match(COOKIE_BANNER_CONTENT_CLASS_NAME, /min-\[900px\]:grid-cols-\[minmax\(0,1fr\)_auto\]/);
});
