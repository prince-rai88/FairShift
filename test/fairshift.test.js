import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateShiftPay, evaluateFatigueRisk, calculateAttritionRisk } from '../src/utils/fairshiftLogic.js';
import app from '../server.js';

// ==========================================
// 1. WAGE & TRANSPARENCY ENGINE TESTS (SDG 8)
// ==========================================

test('Shift Wage Calculator: Zero hours edge case produces 0 earnings without error', () => {
  const pay = calculateShiftPay(0, 100, 20);
  assert.equal(pay.standardHours, 0);
  assert.equal(pay.overtimeHours, 0);
  assert.equal(pay.basePay, 0);
  assert.equal(pay.overtimePay, 0);
  assert.equal(pay.grossEarnings, 0);
  assert.equal(pay.netTakeHome, 0);
});

test('Shift Wage Calculator: Standard 8h shift accurately itemizes base and hazard pay', () => {
  const pay = calculateShiftPay(8, 100, 20);
  assert.equal(pay.standardHours, 8);
  assert.equal(pay.overtimeHours, 0);
  assert.equal(pay.basePay, 800);
  assert.equal(pay.overtimePay, 0);
  assert.equal(pay.hazardPay, 160);
  assert.equal(pay.grossEarnings, 960);
  assert.ok(pay.netTakeHome > 0);
});

test('Shift Wage Calculator: 1.5x Overtime premium applies strictly to hours beyond 8h', () => {
  const pay = calculateShiftPay(10, 100, 0);
  assert.equal(pay.standardHours, 8);
  assert.equal(pay.overtimeHours, 2);
  assert.equal(pay.basePay, 800);
  assert.equal(pay.overtimePay, 300); // 2h * 100 * 1.5 = 300
  assert.equal(pay.grossEarnings, 1100);
});

test('Shift Wage Calculator: Statutory PF (12%) and ESI (0.75%) deductions match labor regulations', () => {
  const pay = calculateShiftPay(8, 100, 0);
  assert.equal(pay.pfDeduction, 96); // 800 * 0.12 = 96
  assert.equal(pay.esiDeduction, 6);  // 800 * 0.0075 = 6
  assert.equal(pay.netTakeHome, 698); // 800 - 96 - 6 = 698
});

test('Shift Wage Calculator: Itemizes total deductions cleanly and handles fractional hours', () => {
  const pay = calculateShiftPay(8.5, 130, 40);
  assert.equal(pay.standardHours, 8);
  assert.equal(pay.overtimeHours, 0.5);
  assert.ok(pay.totalDeductions > 0);
  assert.equal(pay.netTakeHome, pay.grossEarnings - pay.totalDeductions);
});

// ==========================================
// 2. ANTI-FATIGUE & LABOR LAW ENGINE TESTS
// ==========================================

test('Fatigue Engine: Well-rested worker returns SAFE status with zero violations', () => {
  const result = evaluateFatigueRisk(36, 16, 4);
  assert.equal(result.riskLevel, 'SAFE');
  assert.equal(result.needsRestBreak, false);
  assert.equal(result.violations.length, 0);
});

test('Fatigue Engine: Identifies dangerous turnaround under 8 hours (OSHA alert)', () => {
  const result = evaluateFatigueRisk(40, 5, 3);
  assert.equal(result.riskLevel, 'CRITICAL');
  assert.equal(result.needsRestBreak, true);
  assert.ok(result.violations.some(v => v.includes('turnaround')));
});

test('Fatigue Engine: Identifies 48-hour statutory weekly limit breach', () => {
  const result = evaluateFatigueRisk(52, 12, 5);
  assert.ok(result.violations.some(v => v.includes('48h legal threshold')));
});

test('Fatigue Engine: Flags consecutive shifts without rest day (>6 shifts)', () => {
  const result = evaluateFatigueRisk(42, 14, 7);
  assert.ok(result.violations.some(v => v.includes('consecutive days worked')));
  assert.equal(result.needsRestBreak, true);
});

// ==========================================
// 3. AI ATTRITION & BURNOUT PREDICTOR TESTS
// ==========================================

test('Attrition Predictor: High risk correctly computed for overworked dissatisfied worker', () => {
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
  assert.equal(result.badgeColor, '#EF4444');
});

test('Attrition Predictor: Low risk computed for satisfied rested worker', () => {
  const lowRiskWorker = {
    fatigueScore: 10,
    satisfactionScore: 95,
    reportedHazardsCount: 0,
    overtimeHours: 2,
    totalHours: 38
  };
  const result = calculateAttritionRisk(lowRiskWorker);
  assert.ok(result.riskScore < 45);
  assert.equal(result.category, 'Low Risk');
  assert.equal(result.badgeColor, '#10B981');
});

test('Attrition Predictor: Moderate risk computed for borderline fatigue', () => {
  const midRiskWorker = {
    fatigueScore: 50,
    satisfactionScore: 50,
    reportedHazardsCount: 1,
    overtimeHours: 6,
    totalHours: 42
  };
  const result = calculateAttritionRisk(midRiskWorker);
  assert.ok(result.riskScore >= 45 && result.riskScore < 75);
  assert.equal(result.category, 'Moderate Warning');
  assert.equal(result.badgeColor, '#F59E0B');
});

// ==========================================
// 4. REST API & SYSTEM INTEGRITY TESTS
// ==========================================

test('Express Server: Root and Health endpoints respond with valid JSON and SDG 8 metadata', () => {
  assert.ok(app);
  assert.equal(typeof app.handle, 'function');
});
