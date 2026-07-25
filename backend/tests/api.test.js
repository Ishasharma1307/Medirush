const test = require('node:test');
const assert = require('node:assert');
const app = require('../app');
const http = require('node:http');

test('Express API Server Tests', async (t) => {
  let server;
  let baseUrl;

  // Start the server on a dynamic random port before running tests
  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });

  // Close the server after tests complete
  t.after(() => {
    server.close();
  });

  await t.test('GET / should return welcome message', async () => {
    const res = await fetch(`${baseUrl}/`);
    assert.strictEqual(res.status, 200);
    const text = await res.text();
    assert.match(text, /Welcome to the MediRush Backend/i);
  });

  await t.test('GET /api/health should return ok status and timestamp', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'ok');
    assert.ok(data.timestamp);
  });

  await t.test('CORS headers should allow all origins (*)', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(res.headers.get('access-control-allow-origin'), '*');
  });
});
