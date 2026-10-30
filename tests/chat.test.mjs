import assert from 'node:assert/strict';
import { test } from 'node:test';
import chat from '../netlify/functions/chat.mts';

test('chat validates requests and keeps Gemini credentials server-side', async () => {
  const originalFetch = globalThis.fetch;
  const originalNetlify = globalThis.Netlify;
  const credential = 'test-only-credential';
  globalThis.Netlify = { env: { get: () => credential } };
  const request = (body) => new Request('https://example.test/.netlify/functions/chat', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  const prompt = { system: 'Crop data and previous conversation', userContent: 'Rice advice', langLabel: 'Telugu' };
  try {
    let calls = 0;
    globalThis.fetch = async (url, init) => {
      calls++;
      const upstream = new Request(url, init);
      assert.equal(new URL(upstream.url).hostname, 'generativelanguage.googleapis.com');
      assert.ok(upstream.url.includes('gemini-3.8-flash:generateContent'));
      assert.equal(upstream.headers.get('x-goog-api-key'), credential);
      const body = await upstream.json();
      const text = body.contents[0].parts[0].text;
      assert.ok(text.includes(prompt.system));
      assert.ok(text.includes(prompt.userContent));
      assert.ok(text.includes('only in Telugu'));
      assert.equal(body.generationConfig.maxOutputTokens, 1000);
      assert.equal(body.generationConfig.temperature, 0.7);
      return Response.json({ candidates: [{ content: { parts: [{ text: 'Rice ' }, { text: 'advice' }] } }] });
    };
    const success = await chat(request(prompt));
    assert.equal(success.status, 200);
    assert.deepEqual(await success.json(), { text: 'Rice advice' });
    assert.equal(success.headers.get('cache-control'), 'no-store');
    assert.equal(calls, 1);

    assert.equal((await chat(new Request('https://example.test'))).status, 405);
    assert.equal((await chat(request(null))).status, 400);
    assert.equal((await chat(request({ ...prompt, userContent: ' ' }))).status, 400);
    assert.equal((await chat(new Request('https://example.test', { method: 'POST', body: '{' }))).status, 400);
    assert.equal((await chat(request({ ...prompt, system: 'x'.repeat(100_001) }))).status, 413);
    assert.equal(calls, 1);

    globalThis.Netlify.env.get = () => undefined;
    assert.equal((await chat(request(prompt))).status, 503);
    assert.equal(calls, 1);
    globalThis.Netlify.env.get = () => credential;

    globalThis.fetch = async () => Response.json({ candidates: [] });
    assert.equal((await chat(request(prompt))).status, 502);

    globalThis.fetch = async () => { throw new Error(credential); };
    const failure = await chat(request(prompt));
    assert.equal(failure.status, 502);
    assert.ok(!(await failure.text()).includes(credential));

    globalThis.fetch = async () => Response.json(
      { error: { code: 429, message: credential, status: 'RESOURCE_EXHAUSTED' } },
      { status: 429 },
    );
    const busy = await chat(request(prompt));
    assert.equal(busy.status, 429);
    assert.ok(!(await busy.text()).includes(credential));
  } finally {
    globalThis.fetch = originalFetch;
    globalThis.Netlify = originalNetlify;
  }
});
