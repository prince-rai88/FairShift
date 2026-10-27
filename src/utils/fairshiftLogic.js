/**
 * @file fairshiftLogic.js
 * @description Core Algorithmic Engine for FairShift Platform
 * Aligned with UN Sustainable Development Goal 8 (Decent Work & Economic Growth)
 * Targets:
 *  - SDG 8.5: Full and productive employment, equal pay for work of equal value
 *  - SDG 8.8: Protect labour rights, promote safe and secure working environments
 */

/**
 * @typedef {Object} ShiftPayBreakdown
 * @property {number} hours - Total hours worked in shift
 * @property {number} standardHours - Standard hours capped at 8h
 * @property {number} overtimeHours - Statutory overtime hours beyond 8h
 * @property {number} hourlyRate - Base hourly wage in INR
 * @property {number} hazardRate - Statutory hazardous environment hourly premium in INR
 * @property {number} basePay - Base earnings for standard hours
 * @property {number} overtimePay - Overtime earnings calculated at statutory 1.5x multiplier
 * @property {number} hazardPay - Hazard allowance for total shift duration
 * @property {number} grossEarnings - Sum of basePay, overtimePay, and hazardPay
 * @property {number} pfDeduction - Employee Provident Fund deduction (12%)
 * @property {number} esiDeduction - Employee State Insurance deduction (0.75%)
 * @property {number} totalDeductions - Sum of statutory deductions
 * @property {number} netTakeHome - Final net wage after transparent deductions
 */

/**
 * Calculates itemized shift pay according to statutory fair labor standards.
 * Guaranteed 1.5x overtime multiplier for hours exceeding 8 hours.
 *
 * @param {number|string} hoursWorked - Total hours worked in the shift
 * @param {number|string} [hourlyRate=120] - Base wage rate per hour
 * @param {number|string} [hazardRate=25] - Additional hazard rate per hour
 * @returns {ShiftPayBreakdown} Comprehensive wage and deduction itemization
 */
export function calculateShiftPay(hoursWorked, hourlyRate = 120, hazardRate = 25) {
  const hours = Math.max(0, parseFloat(hoursWorked) || 0);
  const rate = Math.max(0, parseFloat(hourlyRate) || 120);
  const hazard = Math.max(0, parseFloat(hazardRate) || 0);

  const standardHours = Math.min(hours, 8);
  const overtimeHours = Math.max(0, hours - 8);

  const basePay = Math.round(standardHours * rate);
  // Statutory 1.5x Overtime premium per international labor standards
  const overtimePay = Math.round(overtimeHours * rate * 1.5);
  const hazardPay = Math.round(hours * hazard);

  const grossEarnings = basePay + overtimePay + hazardPay;

  // Statutory social security contributions
  const pfDeduction = Math.round(grossEarnings * 0.12); // Provident Fund 12%
  const esiDeduction = Math.round(grossEarnings * 0.0075); // Employee State Insurance 0.75%
  const totalDeductions = pfDeduction + esiDeduction;

  const netTakeHome = Math.max(0, grossEarnings - totalDeductions);

  return {
    hours,
    standardHours: Number(standardHours.toFixed(1)),
    overtimeHours: Number(overtimeHours.toFixed(1)),
    hourlyRate: rate,
    hazardRate: hazard,
    basePay,
    overtimePay,
    hazardPay,
    grossEarnings,
    pfDeduction,
    esiDeduction,
    totalDeductions,
    netTakeHome
  };
}

/**
 * @typedef {'SAFE' | 'MODERATE' | 'CRITICAL'} FatigueRiskLevel
 */

/**
 * @typedef {Object} FatigueEvaluation
 * @property {number} weeklyHours - Total hours worked in current work week
 * @property {number} gapHours - Rest turnaround between last shift and current shift
 * @property {number} streak - Consecutive days worked without rest
 * @property {FatigueRiskLevel} riskLevel - Risk categorization level
 * @property {number} riskScore - 0-100 risk score
 * @property {string[]} violations - Specific labor law breaches detected
 * @property {boolean} needsRestBreak - Flag indicating immediate relief required
 */

/**
 * Evaluates frontline worker fatigue and checks for statutory labor violations.
 * Flags:
 *  - Exceeding 48-hour statutory weekly limit (Labor Act violation)
 *  - Turnaround rest gap under 8 hours (OSHA safety violation)
 *  - 7 or more consecutive working shifts without a rest day
 *
 * @param {number|string} weeklyHours - Hours accumulated in the work week
 * @param {number|string} [lastShiftGapHours=12] - Hours between prior shift end and next shift
 * @param {number|string} [consecutiveShifts=4] - Number of consecutive shift days
 * @returns {FatigueEvaluation} Fatigue metrics and violation alerts
 */
export function evaluateFatigueRisk(weeklyHours, lastShiftGapHours = 12, consecutiveShifts = 4) {
  const hours = parseFloat(weeklyHours) || 0;
  const gap = parseFloat(lastShiftGapHours) || 12;
  const streak = parseInt(consecutiveShifts, 10) || 1;

  const violations = [];

  if (hours > 48) {
    violations.push(`Weekly limit exceeded (${hours}h vs 48h legal threshold)`);
  }
  if (gap < 8) {
    violations.push(`Dangerous turnaround gap: Only ${gap}h between shifts (Min 8h required)`);
  }
  if (streak >= 7) {
    violations.push(`No mandatory rest day: ${streak} consecutive days worked`);
  }

  let riskLevel = 'SAFE';
  let score = Math.min(100, Math.round((hours / 48) * 50 + (streak > 5 ? 25 : 0) + (gap < 8 ? 35 : 0)));

  if (violations.length >= 2 || hours > 54 || gap < 8) {
    riskLevel = 'CRITICAL';
    score = Math.max(score, 85);
  } else if (violations.length === 1 || hours > 44 || streak >= 6) {
    riskLevel = 'MODERATE';
    score = Math.max(score, 55);
  }

  return {
    weeklyHours: hours,
    gapHours: gap,
    streak,
    riskLevel,
    riskScore: score,
    violations,
    needsRestBreak: riskLevel !== 'SAFE'
  };
}

/**
 * @typedef {Object} AttritionEvaluation
 * @property {number} riskScore - 0-100 predicted turnover probability
 * @property {string} category - Risk categorization ('Low Risk', 'Moderate Warning', 'High Attrition Risk')
 * @property {string} badgeColor - UI status hex color code
 * @property {{ fatigueWeight: number, dissatisfactionWeight: number, hazardWeight: number }} factors - Component weightings
 */

/**
 * Multi-factor AI Attrition & Burnout Predictor.
 * Calculates probability of frontline worker departure using composite factors:
 * fatigue index (40%), worker dissatisfaction (40%), and unresolved safety hazards (20%).
 *
 * @param {Object} worker - Worker metrics object
 * @param {number} [worker.fatigueScore] - Fatigue score (0-100)
 * @param {number} [worker.satisfactionScore] - Satisfaction score (0-100)
 * @param {number} [worker.reportedHazardsCount] - Unresolved hazards near worker
 * @param {number} [worker.overtimeHours] - Cumulative overtime hours
 * @param {number} [worker.totalHours] - Total hours worked
 * @returns {AttritionEvaluation} Turnout probability and factor breakdown
 */
export function calculateAttritionRisk(worker) {
  const fatigueScore = worker.fatigueScore || 40;
  const satisfactionScore = worker.satisfactionScore || 70; // 0-100
  const unresolvedHazards = worker.reportedHazardsCount || 0;
  const overtimeRatio = (worker.overtimeHours || 0) / Math.max(1, worker.totalHours || 40);

  // High fatigue + low satisfaction + safety hazards -> High quit risk
  let riskScore = Math.round(
    fatigueScore * 0.4 +
    (100 - satisfactionScore) * 0.4 +
    Math.min(unresolvedHazards * 10, 20) +
    overtimeRatio * 20
  );

  riskScore = Math.min(99, Math.max(5, riskScore));

  let category = 'Low Risk';
  let badgeColor = '#10B981';

  if (riskScore >= 75) {
    category = 'High Attrition Risk';
    badgeColor = '#EF4444';
  } else if (riskScore >= 45) {
    category = 'Moderate Warning';
    badgeColor = '#F59E0B';
  }

  return {
    riskScore,
    category,
    badgeColor,
    factors: {
      fatigueWeight: Math.round(fatigueScore * 0.4),
      dissatisfactionWeight: Math.round((100 - satisfactionScore) * 0.4),
      hazardWeight: Math.min(unresolvedHazards * 10, 20)
    }
  };
}
