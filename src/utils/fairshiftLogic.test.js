import { describe, it, expect } from 'vitest';
import { calculateShiftPay, evaluateFatigueRisk, calculateAttritionRisk } from './fairshiftLogic.js';

describe('FairShift Core Decent-Work Engine', () => {
  describe('Shift Wage & Overtime Calculator', () => {
    it('accurately calculates 8-hour standard shift without overtime', () => {
      const pay = calculateShiftPay(8, 100, 20);
      expect(pay.standardHours).toBe(8);
      expect(pay.overtimeHours).toBe(0);
      expect(pay.basePay).toBe(800);
      expect(pay.overtimePay).toBe(0);
      expect(pay.hazardPay).toBe(160);
      expect(pay.grossEarnings).toBe(960);
      expect(pay.netTakeHome).toBeGreaterThan(0);
      expect(pay.netTakeHome).toBeLessThan(pay.grossEarnings);
    });

    it('applies statutory 1.5x premium for overtime beyond 8 hours', () => {
      // 10 hours total: 8 standard + 2 overtime
      const pay = calculateShiftPay(10, 100, 0);
      expect(pay.standardHours).toBe(8);
      expect(pay.overtimeHours).toBe(2);
      expect(pay.basePay).toBe(800);
      // 2 hours * 100 * 1.5 = 300
      expect(pay.overtimePay).toBe(300);
      expect(pay.grossEarnings).toBe(1100);
    });

    it('correctly deducts PF (12%) and ESI (0.75%) with transparent breakdowns', () => {
      const pay = calculateShiftPay(8, 100, 0);
      // gross = 800
      expect(pay.pfDeduction).toBe(Math.round(800 * 0.12)); // 96
      expect(pay.esiDeduction).toBe(Math.round(800 * 0.0075)); // 6
      expect(pay.totalDeductions).toBe(96 + 6);
      expect(pay.netTakeHome).toBe(800 - 102);
    });
  });

  describe('Fatigue & Labor Law Violation Detection', () => {
    it('marks worker SAFE when weekly hours are under 48 with adequate rest', () => {
      const result = evaluateFatigueRisk(38, 14, 4);
      expect(result.riskLevel).toBe('SAFE');
      expect(result.needsRestBreak).toBe(false);
      expect(result.violations.length).toBe(0);
    });

    it('flags CRITICAL alert when turnaround time between shifts is under 8 hours', () => {
      // Dangerously fast turnaround (e.g. night shift ending at 6am, morning shift at 11am = 5h gap)
      const result = evaluateFatigueRisk(40, 5, 3);
      expect(result.riskLevel).toBe('CRITICAL');
      expect(result.needsRestBreak).toBe(true);
      expect(result.violations.some(v => v.includes('turnaround'))).toBe(true);
    });

    it('flags legal overtime violation when weekly hours exceed 48 hours', () => {
      const result = evaluateFatigueRisk(52, 12, 5);
      expect(result.violations.some(v => v.includes('48h legal threshold'))).toBe(true);
      expect(result.needsRestBreak).toBe(true);
    });
  });

  describe('Attrition & Worker Burnout Prediction', () => {
    it('predicts High Attrition Risk for overworked, dissatisfied workers facing hazards', () => {
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

    it('predicts Low Risk for well-rested, satisfied workers', () => {
      const happyWorker = {
        fatigueScore: 25,
        satisfactionScore: 90,
        reportedHazardsCount: 0,
        overtimeHours: 2,
        totalHours: 40
      };
      const result = calculateAttritionRisk(happyWorker);
      expect(result.riskScore).toBeLessThan(45);
      expect(result.category).toBe('Low Risk');
      expect(result.badgeColor).toBe('#10B981');
    });
  });
});
