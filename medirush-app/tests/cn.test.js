import test from 'node:test';
import assert from 'node:assert';
import { cn } from '../src/utils/cn.js';

test('cn Utility Tests', async (t) => {
  await t.test('should merge className strings correctly', () => {
    const result = cn('bg-red-500', 'text-white');
    assert.strictEqual(result.includes('bg-red-500'), true);
    assert.strictEqual(result.includes('text-white'), true);
  });

  await t.test('should merge conditional classnames correctly', () => {
    const isTrue = true;
    const isFalse = false;
    const result = cn('base', isTrue && 'active', isFalse && 'hidden');
    assert.strictEqual(result.includes('base'), true);
    assert.strictEqual(result.includes('active'), true);
    assert.strictEqual(result.includes('hidden'), false);
  });

  await t.test('should resolve Tailwind conflicts via tailwind-merge', () => {
    const result = cn('p-4', 'p-8');
    assert.strictEqual(result.includes('p-4'), false);
    assert.strictEqual(result.includes('p-8'), true);
  });
});
