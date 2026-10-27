from django.urls import path
from . import views

urlpatterns = [
    path('health', views.health_check, name='health_check'),
    path('state', views.get_state, name='get_state'),
    path('shifts/punch-in', views.punch_in_shift, name='punch_in_shift'),
    path('shifts/check-out', views.check_out_shift, name='check_out_shift'),
    path('hazards', views.report_hazard, name='report_hazard'),
    path('hazards/<str:hazard_id>/resolve', views.resolve_hazard, name='resolve_hazard'),
    path('feedback', views.submit_feedback, name='submit_feedback'),
    path('skills/verify', views.verify_skill, name='verify_skill'),
]
