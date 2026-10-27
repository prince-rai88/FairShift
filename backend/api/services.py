"""
FairShift Python Business Logic Services
Aligned with UN Sustainable Development Goal 8 (Decent Work & Economic Growth)
"""
import math

def calculate_shift_pay(hours_worked, hourly_rate=120, hazard_rate=25):
    """
    Statutory Shift Pay Calculator.
    Enforces standard 8-hour limit, statutory 1.5x overtime multiplier,
    and statutory deductions (12% PF, 0.75% ESI).
    """
    hours = max(0.0, float(hours_worked) if hours_worked is not None else 0.0)
    rate = max(0.0, float(hourly_rate) if hourly_rate is not None else 120.0)
    hazard = max(0.0, float(hazard_rate) if hazard_rate is not None else 0.0)

    standard_hours = min(hours, 8.0)
    overtime_hours = max(0.0, hours - 8.0)

    base_pay = round(standard_hours * rate)
    overtime_pay = round(overtime_hours * rate * 1.5)
    hazard_pay = round(hours * hazard)

    gross_earnings = base_pay + overtime_pay + hazard_pay

    pf_deduction = round(gross_earnings * 0.12)
    esi_deduction = round(gross_earnings * 0.0075)
    total_deductions = pf_deduction + esi_deduction

    net_take_home = max(0, gross_earnings - totalDeductions if 'totalDeductions' in locals() else gross_earnings - total_deductions)

    return {
        "hours": hours,
        "standardHours": round(standard_hours, 1),
        "overtimeHours": round(overtime_hours, 1),
        "hourlyRate": rate,
        "hazardRate": hazard,
        "basePay": base_pay,
        "overtimePay": overtime_pay,
        "hazardPay": hazard_pay,
        "grossEarnings": gross_earnings,
        "pfDeduction": pf_deduction,
        "esiDeduction": esi_deduction,
        "totalDeductions": total_deductions,
        "netTakeHome": net_take_home,
    }

def evaluate_fatigue_risk(weekly_hours, last_shift_gap_hours=12, consecutive_shifts=4):
    """
    Evaluates fatigue risk against statutory labor laws:
    - Weekly limit > 48 hours
    - Dangerous turnaround gap < 8 hours
    - Consecutive shifts >= 7 days
    """
    hours = float(weekly_hours) if weekly_hours is not None else 0.0
    gap = float(last_shift_gap_hours) if last_shift_gap_hours is not None else 12.0
    streak = int(consecutive_shifts) if consecutive_shifts is not None else 1

    violations = []
    if hours > 48:
        violations.append(f"Weekly limit exceeded ({hours}h vs 48h legal threshold)")
    if gap < 8:
        violations.append(f"Dangerous turnaround gap: Only {gap}h between shifts (Min 8h required)")
    if streak >= 7:
        violations.append(f"No mandatory rest day: {streak} consecutive days worked")

    risk_level = "SAFE"
    score = min(100, round((hours / 48.0) * 50 + (25 if streak > 5 else 0) + (35 if gap < 8 else 0)))

    if len(violations) >= 2 or hours > 54 or gap < 8:
        risk_level = "CRITICAL"
        score = max(score, 85)
    elif len(violations) == 1 or hours > 44 or streak >= 6:
        risk_level = "MODERATE"
        score = max(score, 55)

    return {
        "weeklyHours": hours,
        "gapHours": gap,
        "streak": streak,
        "riskLevel": risk_level,
        "riskScore": score,
        "violations": violations,
        "needsRestBreak": risk_level != "SAFE",
    }

def calculate_attrition_risk(worker):
    """
    Multi-factor AI attrition & turnover risk index calculation.
    """
    fatigue_score = worker.get("fatigueScore", 40)
    satisfaction_score = worker.get("satisfactionScore", 70)
    unresolved_hazards = worker.get("reportedHazardsCount", 0)
    total_hours = max(1, worker.get("totalHours", 40))
    overtime_hours = worker.get("overtimeHours", 0)
    overtime_ratio = overtime_hours / total_hours

    risk_score = round(
        fatigue_score * 0.4
        + (100 - satisfaction_score) * 0.4
        + min(unresolved_hazards * 10, 20)
        + overtime_ratio * 20
    )

    risk_score = min(99, max(5, risk_score))

    category = "Low Risk"
    badge_color = "#10B981"

    if risk_score >= 75:
        category = "High Attrition Risk"
        badge_color = "#EF4444"
    elif risk_score >= 45:
        category = "Moderate Warning"
        badge_color = "#F59E0B"

    return {
        "riskScore": risk_score,
        "category": category,
        "badgeColor": badge_color,
        "factors": {
            "fatigueWeight": round(fatigue_score * 0.4),
            "dissatisfactionWeight": round((100 - satisfaction_score) * 0.4),
            "hazardWeight": min(unresolved_hazards * 10, 20),
        },
    }
