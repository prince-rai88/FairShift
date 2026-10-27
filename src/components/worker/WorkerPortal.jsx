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
    <div style={{ maxWidth: '1120px', margin: '0 auto' }}>

      {/* Premium Worker Identity Banner */}
      <div className="card" style={{
        padding: '20px 24px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '54px', height: '54px', borderRadius: '16px',
            background: 'var(--accent-black)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', flexShrink: 0,
            boxShadow: '0 4px 12px -2px rgba(15, 23, 42, 0.25)'
          }}>
            {worker.avatar}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {t.welcomeBack}
              </span>
              <span className="badge badge-black" style={{ fontSize: '0.64rem', padding: '2px 8px' }}>
                {worker.id}
              </span>
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text-primary)', marginTop: '2px' }}>
              {worker.name}
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {worker.role} · <strong>{sector.name}</strong>
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{
            background: 'var(--bg-input)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 14px',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ color: 'var(--text-muted)' }}>Base:</span>
            <strong style={{ fontFamily: 'var(--font-mono)' }}>₹{worker.hourlyRate}/h</strong>
            <span style={{ color: 'var(--border-dark)' }}>•</span>
            <span style={{ color: 'var(--text-muted)' }}>Hazard:</span>
            <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)' }}>+₹{worker.hazardRate}/h</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className={`badge ${fatigueAnalysis.riskLevel === 'CRITICAL' ? 'badge-red' : fatigueAnalysis.riskLevel === 'MODERATE' ? 'badge-amber' : 'badge-green'}`} style={{ padding: '6px 12px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: fatigueAnalysis.riskLevel === 'CRITICAL' ? '#EF4444' : fatigueAnalysis.riskLevel === 'MODERATE' ? '#F59E0B' : '#10B981' }} />
              {fatigueAnalysis.riskLevel === 'CRITICAL' ? t.fatigueHigh : fatigueAnalysis.riskLevel === 'MODERATE' ? t.fatigueModerate : t.fatigueNormal}
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation (Modern Segmented Capsule) */}
      <div style={{
        display: 'flex', gap: '8px', flexWrap: 'wrap',
        marginBottom: '24px',
        padding: '4px',
        background: 'rgba(241, 245, 249, 0.7)',
        borderRadius: 'var(--radius-full)',
        border: '1px solid var(--border)'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pill-toggle${activeTab === tab.id ? ' active' : ''}`}
            style={{ fontSize: '0.86rem', padding: '10px 20px', gap: '8px', border: activeTab === tab.id ? 'none' : '1px solid transparent', background: activeTab === tab.id ? 'var(--accent-black)' : 'transparent', boxShadow: activeTab === tab.id ? '0 2px 8px rgba(15, 23, 42, 0.2)' : 'none' }}
          >
            <span style={{ fontSize: '1rem' }}>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content with Smooth Fade Transition */}
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
