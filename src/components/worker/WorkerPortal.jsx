import React, { useState } from 'react';
import ShiftTracker from './ShiftTracker';
import PayslipView from './PayslipView';
import SafetyReport from './SafetyReport';
import AnonymousFeedback from './AnonymousFeedback';
import SkillPassport from './SkillPassport';
import { evaluateFatigueRisk } from '../../utils/fairshiftLogic';

export default function WorkerPortal({
  worker, sector, t, currentLang, activeShift, setActiveShift,
  hazards, onReportHazard, onSubmitFeedback, onAddSkill, onShiftCompleted
}) {
  const [activeTab, setActiveTab] = useState('shift');

  const fatigueAnalysis = evaluateFatigueRisk(
    worker.weeklyHours, worker.lastShiftGapHours, worker.consecutiveShifts
  );

  const tabs = [
    { id: 'shift',    icon: '⏱', label: t.navShift },
    { id: 'payslip',  icon: '💰', label: t.navPayslip },
    { id: 'safety',   icon: '🚨', label: t.navSafety },
    { id: 'feedback', icon: '🔒', label: t.navFeedback },
    { id: 'passport', icon: '🏅', label: t.navPassport },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

      {/* Worker identity hero bar — matching reference mockup header */}
      <div className="card" style={{
        padding: '24px 28px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '18px',
            background: 'linear-gradient(135deg, #1E3A8A 0%, #0284C7 50%, #06B6D4 100%)',
            boxShadow: '0 8px 24px rgba(6, 182, 212, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
            border: '1.5px solid rgba(255, 255, 255, 0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '30px', flexShrink: 0,
            transition: 'transform 0.3s ease',
          }}>
            {worker.avatar}
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.04em' }}>
              Good Morning,
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#FFFFFF' }}>
              {worker.name}
            </div>
            <div style={{ fontSize: '0.84rem', color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <span>{worker.role}</span>
              <span style={{ opacity: 0.4 }}>•</span>
              <span style={{ color: '#94A3B8' }}>{sector.name}</span>
            </div>
          </div>
        </div>

        {/* Quick telemetry pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {/* Rate Badge */}
          <div className="glass-subpanel" style={{
            padding: '12px 20px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.68rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Base Rate</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.15rem', color: '#38BDF8' }}>
              ₹{worker.hourlyRate}/hr
            </div>
          </div>

          {/* Fatigue badge */}
          <div className="glass-subpanel" style={{
            padding: '12px 20px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.68rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
              {t.fatigueRisk}
            </div>
            <span className={`badge ${fatigueAnalysis.riskLevel === 'CRITICAL' ? 'badge-red' : fatigueAnalysis.riskLevel === 'MODERATE' ? 'badge-amber' : 'badge-green'}`}>
              {fatigueAnalysis.riskLevel === 'CRITICAL' ? t.fatigueHigh : fatigueAnalysis.riskLevel === 'MODERATE' ? t.fatigueModerate : t.fatigueNormal}
            </span>
          </div>
        </div>
      </div>

      {/* Tab navigation — floating liquid pill container */}
      <div style={{
        display: 'inline-flex',
        gap: '6px',
        flexWrap: 'wrap',
        marginBottom: '24px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--border-glass)',
        padding: '5px',
        borderRadius: 'var(--radius-full)',
        backdropFilter: 'blur(16px)',
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pill-toggle${activeTab === tab.id ? ' active' : ''}`}
            style={{ fontSize: '0.85rem', padding: '10px 20px', gap: '8px' }}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="fade-in" key={activeTab}>
        {activeTab === 'shift' && (
          <ShiftTracker worker={worker} sector={sector} t={t}
            activeShift={activeShift} setActiveShift={setActiveShift}
            onShiftCompleted={onShiftCompleted} />
        )}
        {activeTab === 'payslip' && (
          <PayslipView worker={worker} sector={sector} t={t} />
        )}
        {activeTab === 'safety' && (
          <SafetyReport sector={sector} t={t} currentLang={currentLang}
            hazards={hazards.filter(h => h.sector === sector.id)}
            onReportHazard={onReportHazard} />
        )}
        {activeTab === 'feedback' && (
          <AnonymousFeedback sector={sector} t={t}
            onSubmitFeedback={onSubmitFeedback} />
        )}
        {activeTab === 'passport' && (
          <SkillPassport worker={worker} sector={sector} t={t}
            onAddSkill={onAddSkill} />
        )}
      </div>

    </div>
  );
}
