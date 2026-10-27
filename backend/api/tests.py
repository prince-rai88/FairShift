from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import Sector, Worker
from .services import calculate_shift_pay, evaluate_fatigue_risk, calculate_attrition_risk

class FairShiftDjangoTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.sector = Sector.objects.create(
            id="construction",
            name="MegaInfra Site Alpha",
            icon="🏗️",
            location="Gate 4",
            standard_rate=130.0,
            hazard_rate=40.0
        )
        self.worker = Worker.objects.create(
            worker_id="WRK-C104",
            name="Ramesh Kumar",
            sector=self.sector,
            role="Lead Scaffolder",
            avatar="👷‍♂️",
            hourly_rate=130.0,
            hazard_rate=40.0,
            weekly_hours=42.0,
            last_shift_gap_hours=14.0,
            consecutive_shifts=5,
            total_hours=168.0,
            overtime_hours=12.0
        )

    def test_health_check_endpoint(self):
        url = reverse('health_check')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'healthy')
        self.assertIn('Django', response.data['backend'])

    def test_get_state_endpoint(self):
        url = reverse('get_state')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('construction', response.data['sectors'])
        self.assertEqual(len(response.data['workers']), 1)

    def test_shift_wage_calculation_service(self):
        pay = calculate_shift_pay(10, 100, 20)
        self.assertEqual(pay['standardHours'], 8)
        self.assertEqual(pay['overtimeHours'], 2)
        self.assertEqual(pay['basePay'], 800)
        self.assertEqual(pay['overtimePay'], 300) # 2 * 100 * 1.5
        self.assertEqual(pay['grossEarnings'], 1300)

    def test_fatigue_evaluation_service(self):
        res = evaluate_fatigue_risk(50, 6, 6) # <8h gap
        self.assertEqual(res['riskLevel'], 'CRITICAL')
        self.assertTrue(res['needsRestBreak'])

    def test_attrition_risk_service(self):
        worker_data = {
            'fatigueScore': 85,
            'satisfactionScore': 25,
            'reportedHazardsCount': 2,
            'overtimeHours': 20,
            'totalHours': 55
        }
        res = calculate_attrition_risk(worker_data)
        self.assertGreaterEqual(res['riskScore'], 75)
        self.assertEqual(res['category'], 'High Attrition Risk')
