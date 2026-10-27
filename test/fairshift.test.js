import { describe, it, expect } from 'vitest';
import { calculateShiftPay, evaluateFatigueRisk, calculateAttritionRisk } from '../src/utils/fairshiftLogic.js';
import app from '../server.js';

describe('FairShift Comprehensive Test Suite (SDG 8)', () => {
  describe('Wage & Transparency Calculations', () => {
    it('handles zero hours edge case gracefully', () => {
      const pay = calculateShiftPay(0, 100, 20);
      expect(pay.standardHours).toBe(0);
      expect(pay.overtimeHours).toBe(0);
      expect(pay.basePay).toBe(0);
      expect(pay.overtimePay).toBe(0);
      expect(pay.grossEarnings).toBe(0);
      expect(pay.netTakeHome).toBe(0);
    });

    it('accurately itemizes base and hazard pay for standard 8h shift', () => {
      const pay = calculateShiftPay(8, 100, 20);
      expect(pay.standardHours).toBe(8);
      expect(pay.overtimeHours).toBe(0);
      expect(pay.basePay).toBe(800);
      expect(pay.overtimePay).toBe(0);
      expect(pay.hazardPay).toBe(160);
      expect(pay.grossEarnings).toBe(960);
      expect(pay.netTakeHome).toBeGreaterThan(0);
    });

    it('applies 1.5x overtime multiplier strictly beyond 8 hours', () => {
      const pay = calculateShiftPay(10, 100, 0);
      expect(pay.standardHours).toBe(8);
      expect(pay.overtimeHours).toBe(2);
      expect(pay.basePay).toBe(800);
      expect(pay.overtimePay).toBe(300); // 2h * 100 * 1.5 = 300
      expect(pay.grossEarnings).toBe(1100);
    });

    it('calculates statutory PF (12%) and ESI (0.75%) deductions accurately', () => {
      const pay = calculateShiftPay(8, 100, 0);
      expect(pay.pfDeduction).toBe(96); // 800 * 0.12 = 96
      expect(pay.esiDeduction).toBe(6);  // 800 * 0.0075 = 6
      expect(pay.netTakeHome).toBe(698); // 800 - 96 - 6 = 698
    });

    it('handles fractional hours and itemizes total deductions', () => {
      const pay = calculateShiftPay(8.5, 130, 40);
      expect(pay.standardHours).toBe(8);
      expect(pay.overtimeHours).toBe(0.5);
      expect(pay.totalDeductions).toBeGreaterThan(0);
      expect(pay.netTakeHome).toBe(pay.grossEarnings - pay.totalDeductions);
    });
  });

  describe('Anti-Fatigue & Labor Law Violation Engine', () => {
    it('marks worker SAFE when weekly hours are within limits with sufficient rest', () => {
      const result = evaluateFatigueRisk(36, 16, 4);
      expect(result.riskLevel).toBe('SAFE');
      expect(result.needsRestBreak).toBe(false);
      expect(result.violations.length).toBe(0);
    });

    it('flags CRITICAL alert for dangerous turnaround under 8 hours', () => {
      const result = evaluateFatigueRisk(40, 5, 3);
      expect(result.riskLevel).toBe('CRITICAL');
      expect(result.needsRestBreak).toBe(true);
      expect(result.violations.some(v => v.includes('turnaround'))).toBe(true);
    });

    it('identifies 48-hour statutory weekly limit breach', () => {
      const result = evaluateFatigueRisk(52, 12, 5);
      expect(result.violations.some(v => v.includes('48h legal threshold'))).toBe(true);
    });

    it('flags consecutive shifts without mandatory rest day (>6 days)', () => {
      const result = evaluateFatigueRisk(42, 14, 7);
      expect(result.violations.some(v => v.includes('consecutive days worked'))).toBe(true);
      expect(result.needsRestBreak).toBe(true);
    });
  });

  describe('AI Attrition & Burnout Predictor', () => {
    it('computes High Attrition Risk for overworked dissatisfied staff', () => {
      const highRiskWorker = {
        fatigueScore: 90,
        satisfactionScore: 20,
        reportedHazardsCount: 3,
        overtimeHours: 25,
        totalHours: 65
      };
      const result = calculateAttritionRisk(highRiskWorker);
      expect(result.riskScore).toBeGreaterThanOrEqual(75);
      expect(result.category).toBe('High Attrition Risk');
      expect(result.badgeColor).toBe('#EF4444');
    });

    it('computes Low Risk for satisfied well-rested staff', () => {
      const lowRiskWorker = {
        fatigueScore: 10,
        satisfactionScore: 95,
        reportedHazardsCount: 0,
        overtimeHours: 2,
        totalHours: 38
      };
      const result = calculateAttritionRisk(lowRiskWorker);
      expect(result.riskScore).toBeLessThan(45);
      expect(result.category).toBe('Low Risk');
      expect(result.badgeColor).toBe('#10B981');
    });

    it('computes Moderate Warning for borderline fatigue indicators', () => {
      const midRiskWorker = {
        fatigueScore: 50,
        satisfactionScore: 50,
        reportedHazardsCount: 1,
        overtimeHours: 6,
        totalHours: 42
      };
      const result = calculateAttritionRisk(midRiskWorker);
      expect(result.riskScore).toBeGreaterThanOrEqual(45);
      expect(result.riskScore).toBeLessThan(75);
      expect(result.category).toBe('Moderate Warning');
      expect(result.badgeColor).toBe('#F59E0B');
    });
  });

  describe('System & Server Architecture', () => {
    it('initializes Express app instance with proper request handler', () => {
      expect(app).toBeDefined();
      expect(typeof app.handle).toBe('function');
    });
  });
});
