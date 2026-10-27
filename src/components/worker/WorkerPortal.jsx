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
    <div style={{ maxWidth: '1060px', margin: '0 auto' }}>

      {/* Worker identity bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '12px', marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '14px',
            background: '#0A0A0A',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '26px', flexShrink: 0,
          }}>
            {worker.avatar}
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {t.welcomeBack}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
              {worker.name}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {worker.role} · {sector.name}
            </div>
          </div>
        </div>

        {/* Fatigue badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="section-label">{t.fatigueRisk}:</span>
          <span className={`badge ${fatigueAnalysis.riskLevel === 'CRITICAL' ? 'badge-red' : fatigueAnalysis.riskLevel === 'MODERATE' ? 'badge-amber' : 'badge-green'}`}>
            {fatigueAnalysis.riskLevel === 'CRITICAL' ? t.fatigueHigh : fatigueAnalysis.riskLevel === 'MODERATE' ? t.fatigueModerate : t.fatigueNormal}
          </span>
        </div>
      </div>

      {/* Tab navigation */}
      <div style={{
        display: 'flex', gap: '6px', flexWrap: 'wrap',
        marginBottom: '24px',
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pill-toggle${activeTab === tab.id ? ' active' : ''}`}
            style={{ fontSize: '0.84rem', padding: '9px 18px', gap: '6px' }}
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
