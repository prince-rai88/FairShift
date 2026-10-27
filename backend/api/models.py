from django.db import models

class Sector(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=150)
    icon = models.CharField(max_length=20, default="🏗️")
    location = models.CharField(max_length=255)
    standard_rate = models.FloatField(default=130.0)
    hazard_rate = models.FloatField(default=40.0)

    def __str__(self):
        return f"{self.icon} {self.name}"

class Worker(models.Model):
    worker_id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=150)
    sector = models.ForeignKey(Sector, on_delete=models.CASCADE, related_name="workers")
    role = models.CharField(max_length=150)
    avatar = models.CharField(max_length=20, default="👷")
    hourly_rate = models.FloatField(default=130.0)
    hazard_rate = models.FloatField(default=40.0)
    weekly_hours = models.FloatField(default=40.0)
    last_shift_gap_hours = models.FloatField(default=12.0)
    consecutive_shifts = models.IntegerField(default=4)
    total_hours = models.FloatField(default=160.0)
    overtime_hours = models.FloatField(default=8.0)
    satisfaction_score = models.IntegerField(default=80)
    reported_hazards_count = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.name} ({self.worker_id})"

class Skill(models.Model):
    worker = models.ForeignKey(Worker, on_delete=models.CASCADE, related_name="skills")
    title = models.CharField(max_length=200)
    issuer = models.CharField(max_length=200)
    date = models.DateField(auto_now_add=True)
    verified = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.title} - {self.worker.name}"

class ShiftRecord(models.Model):
    worker = models.ForeignKey(Worker, on_delete=models.CASCADE, related_name="recent_shifts")
    date = models.CharField(max_length=100)
    hours = models.FloatField(default=8.0)
    base = models.FloatField(default=1040.0)
    ot = models.FloatField(default=0.0)
    net = models.FloatField(default=914.0)
    status = models.CharField(max_length=50, default="Verified")

    def __str__(self):
        return f"Shift {self.worker.name} - {self.date}"

class SafetyHazard(models.Model):
    hazard_id = models.CharField(max_length=50, primary_key=True)
    sector = models.ForeignKey(Sector, on_delete=models.CASCADE, related_name="hazards")
    category = models.CharField(max_length=200)
    location = models.CharField(max_length=255)
    description = models.TextField()
    reported_by = models.CharField(max_length=150, default="Anonymous Worker")
    priority = models.CharField(max_length=50, default="CRITICAL")
    status = models.CharField(max_length=50, default="In Triage")
    timestamp = models.CharField(max_length=100)
    audio_attached = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.hazard_id}: {self.category} ({self.priority})"

class AnonymousFeedback(models.Model):
    feedback_id = models.CharField(max_length=50, primary_key=True)
    sector = models.ForeignKey(Sector, on_delete=models.CASCADE, related_name="feedbacks")
    department = models.CharField(max_length=150)
    supervisor_score = models.FloatField(default=4.0)
    workload_score = models.FloatField(default=3.5)
    facilities_score = models.FloatField(default=4.0)
    comment = models.TextField()
    timestamp = models.CharField(max_length=100)
    anonymity_proof = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.feedback_id} - {self.department}"
