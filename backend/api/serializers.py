from rest_framework import serializers
from .models import Sector, Worker, Skill, ShiftRecord, SafetyHazard, AnonymousFeedback

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'title', 'issuer', 'date', 'verified']

class ShiftRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShiftRecord
        fields = ['id', 'date', 'hours', 'base', 'ot', 'net', 'status']

class WorkerSerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, read_only=True)
    recentShifts = ShiftRecordSerializer(many=True, read_only=True, source='recent_shifts')
    id = serializers.CharField(source='worker_id', read_only=True)
    sector = serializers.CharField(source='sector_id', read_only=True)
    hourlyRate = serializers.FloatField(source='hourly_rate')
    hazardRate = serializers.FloatField(source='hazard_rate')
    weeklyHours = serializers.FloatField(source='weekly_hours')
    lastShiftGapHours = serializers.FloatField(source='last_shift_gap_hours')
    consecutiveShifts = serializers.IntegerField(source='consecutive_shifts')
    totalHours = serializers.FloatField(source='total_hours')
    overtimeHours = serializers.FloatField(source='overtime_hours')
    satisfactionScore = serializers.IntegerField(source='satisfaction_score')
    reportedHazardsCount = serializers.IntegerField(source='reported_hazards_count')

    class Meta:
        model = Worker
        fields = [
            'id', 'name', 'sector', 'role', 'avatar', 'hourlyRate', 'hazardRate',
            'weeklyHours', 'lastShiftGapHours', 'consecutiveShifts', 'totalHours',
            'overtimeHours', 'satisfactionScore', 'reportedHazardsCount',
            'skills', 'recentShifts'
        ]

class SectorSerializer(serializers.ModelSerializer):
    standardRate = serializers.FloatField(source='standard_rate')
    hazardRate = serializers.FloatField(source='hazard_rate')

    class Meta:
        model = Sector
        fields = ['id', 'name', 'icon', 'location', 'standardRate', 'hazardRate']

class SafetyHazardSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='hazard_id')
    sector = serializers.CharField(source='sector_id')
    reportedBy = serializers.CharField(source='reported_by')
    audioAttached = serializers.BooleanField(source='audio_attached')

    class Meta:
        model = SafetyHazard
        fields = [
            'id', 'sector', 'category', 'location', 'description',
            'reportedBy', 'priority', 'status', 'timestamp', 'audioAttached'
        ]

class AnonymousFeedbackSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='feedback_id')
    sector = serializers.CharField(source='sector_id')
    supervisorScore = serializers.FloatField(source='supervisor_score')
    workloadScore = serializers.FloatField(source='workload_score')
    facilitiesScore = serializers.FloatField(source='facilities_score')
    anonymityProof = serializers.CharField(source='anonymity_proof')

    class Meta:
        model = AnonymousFeedback
        fields = [
            'id', 'sector', 'department', 'supervisorScore', 'workloadScore',
            'facilitiesScore', 'comment', 'timestamp', 'anonymityProof'
        ]
