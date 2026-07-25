import test from 'node:test';
import assert from 'node:assert';
import { getSymptomRecommendation } from '../src/utils/symptomRecommendation.js';

test('getSymptomRecommendation Utility Tests', async (t) => {
  await t.test('should return null for null/empty input', () => {
    assert.strictEqual(getSymptomRecommendation(null), null);
    assert.strictEqual(getSymptomRecommendation(''), null);
  });

  await t.test('should suggest Hospital for severe symptoms', () => {
    const result = getSymptomRecommendation('chest pain and breathing difficulty');
    assert.strictEqual(result.suggestedType, 'Hospital');
    assert.strictEqual(result.requireEmergency, true);
    assert.ok(result.warning.includes('nearest hospital'));
  });

  await t.test('should suggest Clinic for moderate symptoms', () => {
    const result = getSymptomRecommendation('stomach weakness and allergy');
    assert.strictEqual(result.suggestedType, 'Clinic');
    assert.strictEqual(result.requireEmergency, false);
  });

  await t.test('should suggest Pharmacy for minor symptoms as fallback', () => {
    const result = getSymptomRecommendation('mild headache and fever');
    assert.strictEqual(result.suggestedType, 'Pharmacy');
    assert.strictEqual(result.requireEmergency, false);
  });
});
