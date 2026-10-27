from django.core.management.base import BaseCommand
from api.models import Sector, Worker, Skill, ShiftRecord, SafetyHazard, AnonymousFeedback

class Command(BaseCommand):
    help = "Seeds initial FairShift domain data across Construction and Hospital sectors"

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding FairShift domain data...")

        # 1. Sectors
        c_sector, _ = Sector.objects.get_or_create(
            id="construction",
            defaults={
                "name": "MegaInfra Site Alpha",
                "icon": "🏗️",
                "location": "Sector 14, Industrial Expressway Gate 4",
                "standard_rate": 130.0,
                "hazard_rate": 40.0
            }
        )
        h_sector, _ = Sector.objects.get_or_create(
            id="hospital",
            defaults={
                "name": "St. Jude Metro Hospital",
                "icon": "🏥",
                "location": "Central Ward Block C & D Sanitation",
                "standard_rate": 145.0,
                "hazard_rate": 50.0
            }
        )

        # 2. Workers
        w1, _ = Worker.objects.get_or_create(
            worker_id="WRK-C104",
            defaults={
                "name": "Ramesh Kumar (रमेश)",
                "sector": c_sector,
                "role": "Lead Scaffolder & Rigger",
                "avatar": "👷‍♂️",
                "hourly_rate": 130.0,
                "hazard_rate": 40.0,
                "weekly_hours": 42.0,
                "last_shift_gap_hours": 14.0,
                "consecutive_shifts": 5,
                "total_hours": 168.0,
                "overtime_hours": 12.0,
                "satisfaction_score": 82,
                "reported_hazards_count": 1
            }
        )
        Skill.objects.get_or_create(worker=w1, title="Heavy Scaffolding Safety (Level 3)", issuer="National Skill Dev Council", verified=True)
        Skill.objects.get_or_create(worker=w1, title="Fall Arrest & Harness Rigging", issuer="MegaInfra Safety Board", verified=True)
        ShiftRecord.objects.get_or_create(worker=w1, date="Yesterday", hours=8.5, base=1040, ot=97.5, net=1001, status="Verified")

        w2, _ = Worker.objects.get_or_create(
            worker_id="WRK-H208",
            defaults={
                "name": "Priya Murugan (பிரியா)",
                "sector": h_sector,
                "role": "Sanitation & Biohazard Lead",
                "avatar": "👩‍⚕️",
                "hourly_rate": 145.0,
                "hazard_rate": 50.0,
                "weekly_hours": 52.0,
                "last_shift_gap_hours": 6.0,
                "consecutive_shifts": 6,
                "total_hours": 184.0,
                "overtime_hours": 24.0,
                "satisfaction_score": 48,
                "reported_hazards_count": 2
            }
        )
        Skill.objects.get_or_create(worker=w2, title="Biomedical Infectious Waste Neutralization", issuer="State Health Dept", verified=True)
        ShiftRecord.objects.get_or_create(worker=w2, date="Yesterday (Night)", hours=10.0, base=1160, ot=435, net=1402, status="Verified")

        # 3. Hazards
        SafetyHazard.objects.get_or_create(
            hazard_id="HAZ-001",
            defaults={
                "sector": c_sector,
                "category": "Fall Hazard / Unsecured Scaffolding",
                "location": "Tower B, 14th Floor Perimeter Scaffold",
                "description": "Toe-boards missing and loose anchor bolts after heavy wind. Severe fall risk for ironworkers.",
                "reported_by": "Anonymous Worker (Voice Note)",
                "priority": "CRITICAL",
                "status": "In Triage",
                "timestamp": "Today at 08:35 AM",
                "audio_attached": True
            }
        )
        SafetyHazard.objects.get_or_create(
            hazard_id="HAZ-002",
            defaults={
                "sector": h_sector,
                "category": "Toxic Chemical / Biohazard Spill",
                "location": "Basement Sterilization Room & Dirty Linen Chute",
                "description": "Disinfectant vapor leak caused eye irritation to two sanitation staff. Exhaust fan broken.",
                "reported_by": "Anonymous Orderly (Voice Note)",
                "priority": "HIGH",
                "status": "In Triage",
                "timestamp": "Today at 09:12 AM",
                "audio_attached": True
            }
        )

        # 4. Anonymous Feedbacks
        AnonymousFeedback.objects.get_or_create(
            feedback_id="FB-101",
            defaults={
                "sector": c_sector,
                "department": "Civil Scaffolding Team",
                "supervisor_score": 4.5,
                "workload_score": 3.8,
                "facilities_score": 4.2,
                "comment": "Drinking water dispensers are now properly shaded. Shift timings have been respected this week.",
                "timestamp": "Yesterday",
                "anonymity_proof": "SHA256:8f4c2...7a01 (Zero Retaliation Guarantee)"
            }
        )
        AnonymousFeedback.objects.get_or_create(
            feedback_id="FB-102",
            defaults={
                "sector": h_sector,
                "department": "Night Sanitation Orderlies",
                "supervisor_score": 2.1,
                "workload_score": 1.8,
                "facilities_score": 3.0,
                "comment": "Consecutive 12-hour shifts without replacement orderlies. Staff are falling asleep during transport.",
                "timestamp": "Today at 06:45 AM",
                "anonymity_proof": "SHA256:b39e1...12cf (Zero Retaliation Guarantee)"
            }
        )

        self.stdout.write(self.style.SUCCESS("FairShift domain data seeded successfully!"))
