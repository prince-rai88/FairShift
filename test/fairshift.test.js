import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateShiftPay, evaluateFatigueRisk, calculateAttritionRisk } from '../src/utils/fairshiftLogic.js';

test('Shift Wage Calculator: Standard 8h shift', () => {
  const pay = calculateShiftPay(8, 100, 20);
  assert.equal(pay.standardHours, 8);
  assert.equal(pay.overtimeHours, 0);
  assert.equal(pay.basePay, 800);
  assert.equal(pay.overtimePay, 0);
  assert.equal(pay.hazardPay, 160);
  assert.equal(pay.grossEarnings, 960);
  assert.ok(pay.netTakeHome > 0);
});

test('Shift Wage Calculator: 1.5x Overtime premium', () => {
  const pay = calculateShiftPay(10, 100, 0);
  assert.equal(pay.standardHours, 8);
  assert.equal(pay.overtimeHours, 2);
  assert.equal(pay.basePay, 800);
  assert.equal(pay.overtimePay, 300); // 2h * 100 * 1.5
  assert.equal(pay.grossEarnings, 1100);
});

test('Shift Wage Calculator: Statutory PF and ESI deductions', () => {
  const pay = calculateShiftPay(8, 100, 0);
  assert.equal(pay.pfDeduction, 96);
  assert.equal(pay.esiDeduction, 6);
  assert.equal(pay.netTakeHome, 698);
});

test('Fatigue Engine: Identifies dangerous turnaround under 8 hours', () => {
  const result = evaluateFatigueRisk(40, 5, 3);
  assert.equal(result.riskLevel, 'CRITICAL');
  assert.equal(result.needsRestBreak, true);
});

test('Fatigue Engine: Identifies 48-hour legal threshold exceedance', () => {
  const result = evaluateFatigueRisk(52, 12, 5);
  assert.ok(result.violations.some(v => v.includes('48h legal threshold')));
});

test('Attrition Predictor: High risk for overworked dissatisfied worker', () => {
  const highRiskWorker = {
    fatigueScore: 90,
    satisfactionScore: 20,
    reportedHazardsCount: 3,
    overtimeHours: 25,
    totalHours: 65
  };
  const result = calculateAttritionRisk(highRiskWorker);
  assert.ok(result.riskScore >= 75);
  assert.equal(result.category, 'High Attrition Risk');
});
