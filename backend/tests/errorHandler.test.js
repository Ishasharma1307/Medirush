const test = require('node:test');
const assert = require('node:assert');
const errorHandler = require('../middleware/errorHandler');

test('Error Handler Middleware Tests', async (t) => {
  await t.test('should return 500 status and details in development mode', () => {
    const origEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const testError = new Error('Test Database Connection Failure');
    let statusCalledWith = null;
    let jsonCalledWith = null;

    const req = {};
    const res = {
      status(code) {
        statusCalledWith = code;
        return this;
      },
      json(body) {
        jsonCalledWith = body;
        return this;
      }
    };
    const next = () => {};

    // Call the error handler
    errorHandler(testError, req, res, next);

    // Restore env
    process.env.NODE_ENV = origEnv;

    // Assertions
    assert.strictEqual(statusCalledWith, 500);
    assert.strictEqual(jsonCalledWith.status, 'error');
    assert.strictEqual(jsonCalledWith.message, 'Test Database Connection Failure');
    assert.ok(jsonCalledWith.error, 'Should include stack trace in dev mode');
  });

  await t.test('should return 500 status and generic message in production mode', () => {
    const origEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const testError = new Error('Sensitive Error Leak');
    let statusCalledWith = null;
    let jsonCalledWith = null;

    const req = {};
    const res = {
      status(code) {
        statusCalledWith = code;
        return this;
      },
      json(body) {
        jsonCalledWith = body;
        return this;
      }
    };
    const next = () => {};

    // Call the error handler
    errorHandler(testError, req, res, next);

    // Restore env
    process.env.NODE_ENV = origEnv;

    // Assertions
    assert.strictEqual(statusCalledWith, 500);
    assert.strictEqual(jsonCalledWith.status, 'error');
    assert.strictEqual(jsonCalledWith.message, 'An unexpected server error occurred.');
    assert.strictEqual(jsonCalledWith.error, undefined, 'Should not leak stack trace in prod mode');
  });
});
