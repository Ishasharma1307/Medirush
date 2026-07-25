import test from 'node:test';
import assert from 'node:assert';
import { simplifyReport } from '../src/utils/reportSimplifierRules.js';

test('simplifyReport Utility Tests', async (t) => {
  await t.test('should identify diabetes blood sugar parameters', () => {
    const text = 'Patient fasting glucose is 140 mg/dL, HbA1c is high at 7.8%';
    const result = simplifyReport(text);
    assert.strictEqual(result.is_emergency, false);
    assert.ok(result.summary.includes('blood sugar'));
    const terms = result.important_terms.map(t => t.term);
    assert.ok(terms.includes('Glucose (Fasting)'));
    assert.ok(terms.includes('HbA1c'));
    assert.ok(result.questions_for_doctor.some(q => q.includes('diet')));
  });

  await t.test('should identify anemia blood parameters', () => {
    const text = 'Hemoglobin levels are low, indicating moderate anemia';
    const result = simplifyReport(text);
    assert.ok(result.summary.includes('blood test'));
    const terms = result.important_terms.map(t => t.term);
    assert.ok(terms.includes('Hemoglobin'));
    assert.ok(terms.includes('Anemia'));
    assert.ok(result.questions_for_doctor.some(q => q.includes('iron')));
  });

  await t.test('should identify thyroid parameters', () => {
    const text = 'TSH level is elevated, suggestive of subclinical thyroid dysfunction';
    const result = simplifyReport(text);
    assert.ok(result.summary.includes('thyroid'));
    const terms = result.important_terms.map(t => t.term);
    assert.ok(terms.includes('TSH'));
  });

  await t.test('should trigger emergency status for critical keywords', () => {
    const text = 'Acutely presenting with severe symptoms of heart attack and stroke';
    const result = simplifyReport(text);
    assert.strictEqual(result.is_emergency, true);
    assert.ok(result.summary.includes('critical'));
    assert.strictEqual(result.questions_for_doctor[0], 'Is this an emergency?');
  });

  await t.test('should fallback gracefully for unrecognized text', () => {
    const text = 'All parameters within normal limits.';
    const result = simplifyReport(text);
    assert.strictEqual(result.is_emergency, false);
    assert.ok(result.summary.includes("couldn't identify"));
    assert.strictEqual(result.important_terms[0].term, 'General Findings');
  });
});
