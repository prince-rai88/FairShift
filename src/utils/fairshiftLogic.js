/**
 * FairShift Decent-Work Core Business Logic
 * Compliant with UN SDG 8 (Fair wages, safe working environments, anti-exploitation)
 */

export function calculateShiftPay(hoursWorked, hourlyRate = 120, hazardRate = 25) {
  const hours = Math.max(0, parseFloat(hoursWorked) || 0);
  const rate = Math.max(0, parseFloat(hourlyRate) || 120);
  const hazard = Math.max(0, parseFloat(hazardRate) || 0);

  const standardHours = Math.min(hours, 8);
  const overtimeHours = Math.max(0, hours - 8);

  const basePay = Math.round(standardHours * rate);
  // 1.5x Overtime premium per statutory fair-labor standards
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
