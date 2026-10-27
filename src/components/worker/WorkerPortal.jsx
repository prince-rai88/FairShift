import React, { useState } from 'react';
import ShiftTracker from './ShiftTracker';
import PayslipView from './PayslipView';
import SafetyReport from './SafetyReport';
import AnonymousFeedback from './AnonymousFeedback';
import SkillPassport from './SkillPassport';
import { evaluateFatigueRisk } from '../../utils/fairshiftLogic';

export default function WorkerPortal({
  worker,
  sector,
  t,
  currentLang,
  activeShift,
  setActiveShift,
  hazards,
  onReportHazard,
  onSubmitFeedback,
  onAddSkill,
  onShiftCompleted,
  isMobileFrame
}) {
  const [activeTab, setActiveTab] = useState('shift'); // 'shift', 'payslip', 'safety', 'feedback', 'passport'

  const fatigueAnalysis = evaluateFatigueRisk(
    worker.weeklyHours,
    worker.lastShiftGapHours,
    worker.consecutiveShifts
  );

  return (
    <div style={{
      maxWidth: isMobileFrame ? '440px' : '960px',
      margin: '0 auto',
      transition: 'all 0.3s ease'
    }}>
      
      {/* Mobile Frame Container Styling if enabled */}
      <div style={isMobileFrame ? {
        border: '12px solid #1F2937',
        borderRadius: '40px',
        overflow: 'hidden',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9)',
        background: 'var(--bg-primary)',
        padding: '16px 12px 24px',
        position: 'relative'
      } : {}}>

        {/* Mobile top notch */}
        {isMobileFrame && (
          <div style={{
            width: '120px',
            height: '18px',
            background: '#1F2937',
            borderRadius: '0 0 14px 14px',
            margin: '-16px auto 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#374151' }} />
          </div>
        )}

        {/* Worker Greeting & Quick Fatigue Status */}
        <div className="glass-panel" style={{
          padding: '18px 20px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00D4AA 0%, #6366F1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              border: '2px solid rgba(255, 255, 255, 0.15)'
            }}>
              {worker.avatar}
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {t.welcomeBack},
              </div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                {worker.name}
              </h2>
              <div style={{ fontSize: '0.75rem', color: '#00D4AA', fontWeight: 600 }}>
                {worker.role}
              </div>
            </div>
          </div>

          {/* Fatigue Index Indicator */}
          <div style={{ textAlign: isMobileFrame ? 'left' : 'right' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {t.fatigueRisk}
            </div>
            <span className={`pill-badge ${fatigueAnalysis.riskLevel === 'CRITICAL' ? 'pill-rose' : fatigueAnalysis.riskLevel === 'MODERATE' ? 'pill-amber' : 'pill-teal'}`} style={{ fontSize: '0.7rem' }}>
              {fatigueAnalysis.riskLevel === 'CRITICAL' ? t.fatigueHigh : fatigueAnalysis.riskLevel === 'MODERATE' ? t.fatigueModerate : t.fatigueNormal}
            </span>
          </div>
        </div>

        {/* Navigation Tabs — large, clear touch targets */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '6px',
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '8px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '24px',
          border: '1px solid var(--border-subtle)'
        }}>
          {[
            { id: 'shift', label: t.navShift, icon: '⏱️' },
            { id: 'payslip', label: t.navPayslip, icon: '💰' },
            { id: 'safety', label: t.navSafety, icon: '🚨' },
            { id: 'feedback', label: t.navFeedback, icon: '🔒' },
            { id: 'passport', label: t.navPassport, icon: '🏅' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 4px',
                borderRadius: 'var(--radius-sm)',
                background: activeTab === tab.id ? 'rgba(0, 212, 170, 0.18)' : 'transparent',
                color: activeTab === tab.id ? '#00D4AA' : 'var(--text-secondary)',
                border: activeTab === tab.id ? '1px solid rgba(0, 212, 170, 0.35)' : '1px solid transparent',
                transition: 'all 0.2s',
                gap: '4px'
              }}
            >
              <span style={{ fontSize: '1.4rem' }}>{tab.icon}</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        {activeTab === 'shift' && (
          <ShiftTracker
            worker={worker}
            sector={sector}
            t={t}
            activeShift={activeShift}
            setActiveShift={setActiveShift}
            onShiftCompleted={onShiftCompleted}
          />
        )}

        {activeTab === 'payslip' && (
          <PayslipView
            worker={worker}
            sector={sector}
            t={t}
          />
        )}

        {activeTab === 'safety' && (
          <SafetyReport
            sector={sector}
            t={t}
            currentLang={currentLang}
            hazards={hazards.filter(h => h.sector === sector.id)}
            onReportHazard={onReportHazard}
          />
        )}

        {activeTab === 'feedback' && (
          <AnonymousFeedback
            sector={sector}
            t={t}
            onSubmitFeedback={onSubmitFeedback}
          />
        )}

        {activeTab === 'passport' && (
          <SkillPassport
            worker={worker}
            sector={sector}
            t={t}
            onAddSkill={onAddSkill}
          />
        )}

      </div>

    </div>
  );
}
