import assert from "node:assert/strict";
import { afterEach, beforeEach, mock, test } from "node:test";
import { handleMetaConversionsRequest } from "./meta-conversions.ts";

const originalFetch = globalThis.fetch;
const envKeys = ["NEXT_PUBLIC_META_PIXEL_ID", "META_CONVERSIONS_API_ACCESS_TOKEN", "META_CONVERSIONS_API_TEST_EVENT_CODE", "META_GRAPH_API_VERSION"];
let originalEnv;

beforeEach(() => {
  originalEnv = Object.fromEntries(envKeys.map((key) => [key, process.env[key]]));
  process.env.NEXT_PUBLIC_META_PIXEL_ID = "1234567890";
  process.env.META_CONVERSIONS_API_ACCESS_TOKEN = "test-private-token";
  delete process.env.META_CONVERSIONS_API_TEST_EVENT_CODE;
  delete process.env.META_GRAPH_API_VERSION;
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const key of envKeys) {
    if (originalEnv[key] === undefined) delete process.env[key];
    else process.env[key] = originalEnv[key];
  }
  mock.restoreAll();
});

function createEvent(overrides = {}) {
  return {
    event_name: "Contact",
    event_id: "contact-123",
    event_time: Math.floor(Date.now() / 1000),
    event_source_url: "https://codebalance.test/?email=private#contacto",
    custom_data: { content_name: "Contactanos", contact_method: "whatsapp", event_location: "cta" },
    ...overrides,
  };
}

function createRequest(body = { consent: true, events: [createEvent()] }, headers = {}) {
  return new Request("https://codebalance.test/api/meta/conversions", {
    method: "POST",
    headers: { origin: "https://codebalance.test", "content-type": "application/json", "user-agent": "Test Browser", "x-forwarded-for": "203.0.113.42", ...headers },
    body: JSON.stringify(body),
  });
}

test("server forwards events with private authorization and request attribution", async () => {
  const calls = [];
  const fbp = "fb.1.1760000000000.123456789";
  const fbc = "fb.1.1760000000000.real-click-id";
  process.env.META_CONVERSIONS_API_TEST_EVENT_CODE = "TEST123";
  globalThis.fetch = async (...args) => {
    calls.push(args);
    return Response.json({ events_received: 2 });
  };
  const event = createEvent();
  const response = await handleMetaConversionsRequest(createRequest({ consent: true, events: [event, createEvent({ event_name: "Lead", event_id: "lead-123" })] }, { cookie: `_fbp=${fbp}; _fbc=${fbc}` }));

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { events_received: 2 });
  assert.equal(calls[0][0], "https://graph.facebook.com/v26.0/1234567890/events");
  const options = calls[0][1];
  assert.equal(options.headers.Authorization, "Bearer test-private-token");
  const payload = JSON.parse(options.body);
  assert.equal(payload.test_event_code, "TEST123");
  assert.equal(payload.data[0].event_id, event.event_id);
  assert.equal(payload.data[0].event_source_url, "https://codebalance.test/");
  assert.equal(payload.data[0].action_source, "website");
  assert.deepEqual(payload.data[0].user_data, { client_ip_address: "203.0.113.42", client_user_agent: "Test Browser", fbp, fbc });
  assert.equal(payload.access_token, undefined);
});

test("requests from other origins or without consent never reach Meta", async () => {
  const calls = [];
  globalThis.fetch = async (...args) => { calls.push(args); return Response.json({ events_received: 1 }); };

  for (const request of [createRequest(undefined, { origin: "https://other.test" }), createRequest({ consent: false, events: [createEvent()] }), createRequest({ events: [createEvent()] })]) {
    const response = await handleMetaConversionsRequest(request);
    assert.equal(response.status, 403);
  }
  assert.deepEqual(calls, []);
});

test("unknown events, invalid IDs, timestamps, URLs, metadata and oversized batches are rejected", async () => {
  globalThis.fetch = () => { assert.fail("Invalid events must never reach Meta"); };
  const invalidEvents = [
    [createEvent({ event_name: "Purchase" })],
    [createEvent({ event_id: "" })],
    [createEvent({ event_time: 0 })],
    [createEvent({ event_source_url: "https://other.test/" })],
    [createEvent({ custom_data: { content_name: { nested: true } } })],
    Array.from({ length: 4 }, () => createEvent()),
    [],
  ];
  for (const events of invalidEvents) {
    const response = await handleMetaConversionsRequest(createRequest({ consent: true, events }));
    assert.equal(response.status, 400);
  }
});

test("only the known contact metadata is forwarded", async () => {
  let payload;
  globalThis.fetch = async (_url, options) => {
    payload = JSON.parse(options.body);
    return Response.json({ events_received: 1 });
  };
  const response = await handleMetaConversionsRequest(createRequest({ consent: true, events: [createEvent({ custom_data: { content_name: "Contacto", email: "private@example.test" } })] }));
  assert.equal(response.status, 200);
  assert.deepEqual(payload.data[0].custom_data, { content_name: "Contacto" });
});

test("Meta is not called until the private token is configured", async () => {
  delete process.env.META_CONVERSIONS_API_ACCESS_TOKEN;
  globalThis.fetch = () => { assert.fail("Missing configuration must not call Meta"); };
  const response = await handleMetaConversionsRequest(createRequest());
  assert.equal(response.status, 204);
});

test("same-origin requests work when Next normalizes the internal URL to localhost", async () => {
  delete process.env.META_CONVERSIONS_API_ACCESS_TOKEN;
  const request = new Request("http://localhost:43210/api/meta/conversions", {
    method: "POST",
    headers: { origin: "http://127.0.0.1:43210", host: "127.0.0.1:43210", "content-type": "application/json" },
    body: JSON.stringify({ consent: true, events: [createEvent({ event_source_url: "http://127.0.0.1:43210/" })] }),
  });
  assert.equal((await handleMetaConversionsRequest(request)).status, 204);
});

test("origin validation accounts for the public HTTPS protocol behind a proxy", async () => {
  delete process.env.META_CONVERSIONS_API_ACCESS_TOKEN;
  const request = new Request("http://localhost:3000/api/meta/conversions", {
    method: "POST",
    headers: { origin: "https://codebalance.test", host: "codebalance.test", "x-forwarded-proto": "https", "content-type": "application/json" },
    body: JSON.stringify({ consent: true, events: [createEvent()] }),
  });
  assert.equal((await handleMetaConversionsRequest(request)).status, 204);
});

test("attribution from a real landing click is forwarded when the fbc cookie is absent", async () => {
  let payload;
  globalThis.fetch = async (_url, options) => { payload = JSON.parse(options.body); return Response.json({ events_received: 1 }); };
  await handleMetaConversionsRequest(createRequest({ consent: true, events: [createEvent()], fbc: "fb.1.1760000000000.real-click-id" }));
  assert.equal(payload.data[0].user_data.fbc, "fb.1.1760000000000.real-click-id");
  assert.equal(payload.test_event_code, undefined);
});

test("a new landing click replaces a stale fbc cookie but preserves the cookie for the same click", async () => {
  const cookieFbc = "fb.1.1760000000000.previous-click";
  let payload;
  globalThis.fetch = async (_url, options) => { payload = JSON.parse(options.body); return Response.json({ events_received: 1 }); };

  for (const [landingFbc, expectedFbc] of [
    ["fb.1.1760000001000.new-click", "fb.1.1760000001000.new-click"],
    ["fb.1.1760000001000.previous-click", cookieFbc],
  ]) {
    await handleMetaConversionsRequest(createRequest({ consent: true, events: [createEvent()], fbc: landingFbc }, { cookie: `_fbc=${cookieFbc}` }));
    assert.equal(payload.data[0].user_data.fbc, expectedFbc);
  }
});

test("upstream failures do not expose credentials or visitor data", async () => {
  const logs = [];
  mock.method(console, "error", (...args) => logs.push(args));
  globalThis.fetch = async () => Response.json({ error: { code: 190, message: "test-private-token private@example.test" } }, { status: 400 });

  const response = await handleMetaConversionsRequest(createRequest());
  assert.equal(response.status, 502);
  const output = `${await response.text()} ${JSON.stringify(logs)}`;
  assert.doesNotMatch(output, /test-private-token|private@example/);
});

test("network errors are handled without leaking the request", async () => {
  mock.method(console, "error", () => {});
  globalThis.fetch = async () => { throw new Error("Network failure: test-private-token"); };
  const response = await handleMetaConversionsRequest(createRequest());
  assert.equal(response.status, 502);
  assert.doesNotMatch(await response.text(), /test-private-token/);
});

test("wrong content types and oversized bodies are rejected", async () => {
  globalThis.fetch = () => { assert.fail("Invalid requests must not call Meta"); };
  assert.equal((await handleMetaConversionsRequest(createRequest(undefined, { "content-type": "text/plain" }))).status, 415);
  assert.equal((await handleMetaConversionsRequest(createRequest({ consent: true, padding: "x".repeat(9000), events: [createEvent()] }))).status, 413);
});
