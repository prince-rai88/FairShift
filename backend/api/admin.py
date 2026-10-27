from django.contrib import admin
from .models import Sector, Worker, Skill, ShiftRecord, SafetyHazard, AnonymousFeedback

@admin.register(Sector)
class SectorAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'icon', 'standard_rate', 'hazard_rate')

@admin.register(Worker)
class WorkerAdmin(admin.ModelAdmin):
    list_display = ('worker_id', 'name', 'sector', 'role', 'hourly_rate', 'weekly_hours', 'satisfaction_score')
    list_filter = ('sector', 'role')
    search_fields = ('name', 'worker_id')

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('title', 'worker', 'issuer', 'date', 'verified')
    list_filter = ('verified', 'issuer')

@admin.register(ShiftRecord)
class ShiftRecordAdmin(admin.ModelAdmin):
    list_display = ('worker', 'date', 'hours', 'base', 'ot', 'net', 'status')
    list_filter = ('status',)

@admin.register(SafetyHazard)
class SafetyHazardAdmin(admin.ModelAdmin):
    list_display = ('hazard_id', 'sector', 'category', 'priority', 'status', 'reported_by')
    list_filter = ('sector', 'priority', 'status')

@admin.register(AnonymousFeedback)
class AnonymousFeedbackAdmin(admin.ModelAdmin):
    list_display = ('feedback_id', 'sector', 'department', 'supervisor_score', 'workload_score', 'timestamp')
    list_filter = ('sector', 'department')
