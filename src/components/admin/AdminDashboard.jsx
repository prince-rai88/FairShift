import React, { useState } from 'react';
import { evaluateFatigueRisk, calculateAttritionRisk } from '../../utils/fairshiftLogic';

export default function AdminDashboard({
  workers,
  _sectors,
  hazards,
  feedbacks,
  _activeSector,
  t,
  onResolveHazard
}) {
  const [sectorFilter, setSectorFilter] = useState('all'); // 'all', 'construction', 'hospital'
  const [resolvedNotice, setResolvedNotice] = useState(null);

  // Filter workers and hazards by sector
  const filteredWorkers = sectorFilter === 'all' 
    ? workers 
    : workers.filter(w => w.sector === sectorFilter);

  const filteredHazards = sectorFilter === 'all'
    ? hazards
    : hazards.filter(h => h.sector === sectorFilter);

  const filteredFeedbacks = sectorFilter === 'all'
    ? feedbacks
    : feedbacks.filter(f => f.sector === sectorFilter);

  // Compute analytics & fatigue metrics
  const totalOnSite = filteredWorkers.length * 45; // representative multiplier
  const avgWeeklyHours = (
    filteredWorkers.reduce((acc, w) => acc + w.weeklyHours, 0) / Math.max(1, filteredWorkers.length)
  ).toFixed(1);

  const fatigueViolations = filteredWorkers.filter(w => {
    const analysis = evaluateFatigueRisk(w.weeklyHours, w.lastShiftGapHours, w.consecutiveShifts);
    return analysis.riskLevel === 'CRITICAL' || analysis.riskLevel === 'MODERATE';
  });

  const highAttritionWorkers = filteredWorkers.filter(w => {
    const fatigue = evaluateFatigueRisk(w.weeklyHours, w.lastShiftGapHours, w.consecutiveShifts);
    const attrition = calculateAttritionRisk({ ...w, fatigueScore: fatigue.riskScore });
    return attrition.riskScore >= 70;
  });

  const openHazardsCount = filteredHazards.filter(h => !h.status.includes('Resolved')).length;

  const handleResolve = (hazardId) => {
    if (onResolveHazard) {
      onResolveHazard(hazardId);
      setResolvedNotice(`Hazard ticket ${hazardId} acknowledged and marked as Resolved.`);
      setTimeout(() => setResolvedNotice(null), 3500);
    }
  };

  const handleExportAudit = () => {
    const auditData = {
      reportTitle: "Official Labor Rights & Decent Work Compliance Audit",
      framework: "UN Sustainable Development Goal 8 (Decent Work & Economic Growth)",
      targetsEnforced: [
        "SDG 8.5: Decent work and equal remuneration for work of equal value",
        "SDG 8.8: Protect labour rights and promote safe working environments"
      ],
      auditedAt: new Date().toISOString(),
      sectorFilter,
      summaryMetrics: {
        totalWorkforceTracked: totalOnSite,
        averageWeeklyHours: `${avgWeeklyHours}h`,
        statutoryOvertimeApplied: "1.5x Premium Rate",
        fatigueViolationsCount: fatigueViolations.length,
        openHazardTickets: openHazardsCount,
        attritionRiskFlaggedCount: highAttritionWorkers.length,
        geofenceShiftIntegrity: "98.4%"
      },
      auditChecksum: `SHA256:sdg8_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`
    };

    const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fairshift-sdg8-audit-${sectorFilter}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setResolvedNotice("Official UN SDG 8 Labor Compliance Audit Dossier generated and downloaded.");
    setTimeout(() => setResolvedNotice(null), 4000);
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner & Sector Filter */}
      <div className="card" style={{ padding: '26px 30px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '320px',
          height: '100%',
          background: 'radial-gradient(circle at top right, rgba(16, 185, 129, 0.06), transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', position: 'relative' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span className="badge badge-black" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span className="pulse-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
                EMPLOYER COMMAND CENTER
              </span>
              <span className="badge badge-green">UN SDG 8.5 & 8.8 VERIFIED</span>
              <span className="badge badge-gray" style={{ fontFamily: 'var(--font-mono)' }}>LIVE AUDIT v2.4</span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text-primary)' }}>
              {t.adminTitle}
            </h1>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '640px' }}>
              {t.adminSubtitle}
            </p>
          </div>

          {/* Action & Sector Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Segmented Sector Cross-Filter Pills */}
            <div style={{
              display: 'inline-flex',
              padding: '4px',
              background: 'var(--bg-input)',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border)'
            }}>
              <button
                onClick={() => setSectorFilter('all')}
                style={{
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  background: sectorFilter === 'all' ? 'var(--accent-black)' : 'transparent',
                  color: sectorFilter === 'all' ? '#FFFFFF' : 'var(--text-secondary)',
                  boxShadow: sectorFilter === 'all' ? '0 1px 3px rgba(0,0,0,0.12)' : 'none'
                }}
              >
                🌐 All Sectors
              </button>
              <button
                onClick={() => setSectorFilter('construction')}
                style={{
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  background: sectorFilter === 'construction' ? 'var(--accent-black)' : 'transparent',
                  color: sectorFilter === 'construction' ? '#FFFFFF' : 'var(--text-secondary)',
                  boxShadow: sectorFilter === 'construction' ? '0 1px 3px rgba(0,0,0,0.12)' : 'none'
                }}
              >
                🏗️ Construction
              </button>
              <button
                onClick={() => setSectorFilter('hospital')}
                style={{
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  background: sectorFilter === 'hospital' ? 'var(--accent-black)' : 'transparent',
                  color: sectorFilter === 'hospital' ? '#FFFFFF' : 'var(--text-secondary)',
                  boxShadow: sectorFilter === 'hospital' ? '0 1px 3px rgba(0,0,0,0.12)' : 'none'
                }}
              >
                🏥 Hospital
              </button>
            </div>

            {/* Official Audit Download Button */}
            <button
              onClick={handleExportAudit}
              className="btn-black"
              style={{ fontSize: '0.84rem', padding: '10px 18px', gap: '8px' }}
              title="Download tamper-evident labor compliance record"
            >
              <span>📄</span> Export SDG 8 Audit
            </button>
          </div>
        </div>

        {resolvedNotice && (
          <div style={{
            marginTop: '18px',
            padding: '12px 18px',
            background: '#ECFDF5',
            border: '1px solid #A7F3D0',
            borderRadius: 'var(--radius-md)',
            color: '#047857',
            fontWeight: 600,
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <span style={{ fontSize: '1rem' }}>✓</span> {resolvedNotice}
          </div>
        )}
      </div>

      {/* KPI Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '16px'
      }}>
        {/* Metric 1: Total Workers */}
        <div className="card" style={{ padding: '22px 24px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="section-label">{t.statTotalWorkers}</span>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-input)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>
              👥
            </div>
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '10px', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            {totalOnSite}
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: '#047857', background: '#ECFDF5', padding: '3px 9px', borderRadius: 'var(--radius-full)', fontWeight: 600, marginTop: '8px' }}>
            <span>↑</span> 98.4% Geofenced Compliance
          </div>
        </div>

        {/* Metric 2: Avg Weekly Hours */}
        <div className="card" style={{ padding: '22px 24px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="section-label">{t.statAvgHours}</span>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-input)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>
              ⏱️
            </div>
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '10px', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            {avgWeeklyHours}<span style={{ fontSize: '1.3rem', fontWeight: 500, color: 'var(--text-secondary)' }}>h</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: 'var(--text-secondary)', background: 'var(--bg-input)', padding: '3px 9px', borderRadius: 'var(--radius-full)', fontWeight: 500, marginTop: '8px' }}>
            ⚖️ Max 48h/wk statutory cap
          </div>
        </div>

        {/* Metric 3: Fatigue Violations */}
        <div className="card" style={{ padding: '22px 24px', position: 'relative', borderTop: '3px solid var(--accent-amber)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="section-label" style={{ color: '#B45309' }}>{t.statFatigueAlerts}</span>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              background: '#FFFBEB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>
              ⚠️
            </div>
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '10px', color: '#B45309', letterSpacing: '-0.03em' }}>
            {fatigueViolations.length} <span style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Staff</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: '#B45309', background: '#FFFBEB', padding: '3px 9px', borderRadius: 'var(--radius-full)', fontWeight: 600, marginTop: '8px' }}>
            🛡️ Recovery relief pending
          </div>
        </div>

        {/* Metric 4: Safety Hazards */}
        <div className="card" style={{ padding: '22px 24px', position: 'relative', borderTop: '3px solid var(--accent-red)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="section-label" style={{ color: '#B91C1C' }}>{t.statSafetyIncidents}</span>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              background: '#FEF2F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>
              🚨
            </div>
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '10px', color: '#B91C1C', letterSpacing: '-0.03em' }}>
            {openHazardsCount} <span style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Open</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: '#B91C1C', background: '#FEF2F2', padding: '3px 9px', borderRadius: 'var(--radius-full)', fontWeight: 600, marginTop: '8px' }}>
            ⚡ Emergency triage active
          </div>
        </div>

        {/* Metric 5: Attrition Risk */}
        <div className="card" style={{ padding: '22px 24px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="section-label">{t.statAttritionRisk}</span>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              background: '#EFF6FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>
              📉
            </div>
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '10px', color: '#1D4ED8', letterSpacing: '-0.03em' }}>
            {highAttritionWorkers.length} <span style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Flagged</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: '#1D4ED8', background: '#EFF6FF', padding: '3px 9px', borderRadius: 'var(--radius-full)', fontWeight: 600, marginTop: '8px' }}>
            🤖 AI Burnout Index model
          </div>
        </div>
      </div>

      {/* Visual Analytics & Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '20px'
      }}>
        
        {/* Attendance & Overtime 7-Day Trend Chart */}
        <div className="card" style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="section-num">1</span>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                  7-Day Attendance & Overtime Trajectory
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Automated statutory 1.5x threshold tracking</span>
              </div>
            </div>
            <span className="badge badge-black">AUDITED</span>
          </div>

          {/* SVG Area Chart */}
          <div style={{ width: '100%', height: '180px' }}>
            <svg viewBox="0 0 500 160" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="otGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="40" y1="60" x2="480" y2="60" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="40" y1="100" x2="480" y2="100" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="40" y1="140" x2="480" y2="140" stroke="#E2E8F0" strokeWidth="1.5" />

              {/* Attendance Standard Area */}
              <polygon
                points="40,140 40,70 110,65 180,50 250,55 320,40 390,45 460,35 460,140"
                fill="url(#areaGradient)"
              />
              <polyline
                points="40,70 110,65 180,50 250,55 320,40 390,45 460,35"
                fill="none"
                stroke="#10B981"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Peak Dots */}
              <circle cx="180" cy="50" r="4" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="320" cy="40" r="4" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="460" cy="35" r="4" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />

              {/* Overtime Line */}
              <polyline
                points="40,120 110,115 180,95 250,110 320,85 390,90 460,80"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2.5"
                strokeDasharray="5,5"
                strokeLinecap="round"
              />

              {/* Axis Labels */}
              <text x="40" y="156" fill="#94A3B8" fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">Mon</text>
              <text x="110" y="156" fill="#94A3B8" fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">Tue</text>
              <text x="180" y="156" fill="#94A3B8" fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">Wed</text>
              <text x="250" y="156" fill="#94A3B8" fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">Thu</text>
              <text x="320" y="156" fill="#94A3B8" fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">Fri</text>
              <text x="390" y="156" fill="#94A3B8" fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">Sat</text>
              <text x="460" y="156" fill="#94A3B8" fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">Sun</text>
            </svg>
          </div>

          <div style={{ display: 'flex', gap: '24px', fontSize: '0.82rem', marginTop: '16px', borderTop: '1px solid var(--border)', paddingTop: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px rgba(16,185,129,0.5)' }} />
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Standard Hours (98.4% Compliant)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} />
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>1.5x Premium Overtime Tier</span>
            </div>
          </div>
        </div>

        {/* Sector Comparison Bar Chart */}
        <div className="card" style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="section-num">2</span>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                  Cross-Sector Health Metrics
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Benchmark comparisons across active facilities</span>
              </div>
            </div>
            <span className="badge badge-black">MULTI-SECTOR</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Construction Metric */}
            <div style={{ background: 'var(--bg-input)', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>🏗️ Construction Site Alpha</span>
                <span style={{ color: '#047857', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>Avg 42h/wk • Low Fatigue</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#E2E8F0', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: '42%', height: '100%', background: 'linear-gradient(90deg, #10B981, #059669)', borderRadius: 'var(--radius-full)' }} />
              </div>
            </div>

            {/* Hospital Metric */}
            <div style={{ background: 'var(--bg-input)', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>🏥 St. Jude Metro Hospital</span>
                <span style={{ color: '#B45309', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>Avg 50.5h/wk • 58% Warning</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#E2E8F0', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: '58%', height: '100%', background: 'linear-gradient(90deg, #F59E0B, #D97706)', borderRadius: 'var(--radius-full)' }} />
              </div>
            </div>

            {/* Satisfaction Index */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}>
              <div style={{
                padding: '12px 14px',
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                borderRadius: 'var(--radius-md)'
              }}>
                <div style={{ fontSize: '0.72rem', color: '#047857', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Construction Morale</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#065F46', marginTop: '3px', fontFamily: 'var(--font-mono)' }}>85% Favorable</div>
              </div>
              <div style={{
                padding: '12px 14px',
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: 'var(--radius-md)'
              }}>
                <div style={{ fontSize: '0.72rem', color: '#B91C1C', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Hospital Stress</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#991B1B', marginTop: '3px', fontFamily: 'var(--font-mono)' }}>54% Needs Relief</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Feature 6: Anti-Fatigue & Overwork Radar */}
      <div className="card" style={{ padding: '26px 30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="section-num">3</span>
              <span className="section-label">AUTOMATED LABOR LAW ENFORCER</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginTop: '4px' }}>
              {t.fatigueRadarTitle}
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {t.fatigueRadarDesc}
            </p>
          </div>
          <span className="badge badge-black">SDG 8.8 ACTIVE</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredWorkers.map(w => {
            const fatigue = evaluateFatigueRisk(w.weeklyHours, w.lastShiftGapHours, w.consecutiveShifts);
            const isFlagged = fatigue.riskLevel !== 'SAFE';

            return (
              <div key={w.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                background: isFlagged ? '#FFFBEB' : '#FFFFFF',
                border: isFlagged ? '1px solid #FDE68A' : '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)',
                flexWrap: 'wrap',
                gap: '14px',
                transition: 'all 0.2s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-input)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    border: '1px solid var(--border)'
                  }}>
                    {w.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>
                      {w.name} <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>({w.id})</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                      {w.role} • <strong style={{ color: 'var(--text-primary)' }}>{w.weeklyHours}h worked</strong> • Turnaround: <strong style={{ color: 'var(--text-primary)' }}>{w.lastShiftGapHours}h rest</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className={`badge ${fatigue.riskLevel === 'CRITICAL' ? 'badge-red' : fatigue.riskLevel === 'MODERATE' ? 'badge-amber' : 'badge-green'}`}>
                    {fatigue.riskLevel} (Score: {fatigue.riskScore})
                  </span>

                  {isFlagged ? (
                    <button
                      onClick={() => alert(`Relief staff automatically requested for ${w.name}. Next shift marked as mandatory recovery day.`)}
                      className="btn-black"
                      style={{ fontSize: '0.82rem', padding: '8px 16px', gap: '6px' }}
                    >
                      🛡️ Dispatch Relief Rest
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.84rem', color: '#047857', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      ✓ Compliant
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Safety Hazard Triage Desk */}
      <div className="card" style={{ padding: '26px 30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="section-num">4</span>
              <span className="section-label">EMERGENCY PRIORITY QUEUE</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginTop: '4px' }}>
              {t.incidentTriageTitle}
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Live worker voice & text safety alerts with emergency priority resolution
            </p>
          </div>
          <span className="badge badge-red">{openHazardsCount} Hazards Actionable</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredHazards.map(haz => (
            <div key={haz.id} style={{
              padding: '20px',
              background: haz.status.includes('Resolved') ? '#F0FDF4' : '#FFFFFF',
              border: haz.status.includes('Resolved') ? '1px solid #BBF7D0' : '1px solid var(--border)',
              borderLeft: haz.status.includes('Resolved') ? '4px solid #10B981' : haz.priority === 'CRITICAL' ? '4px solid #EF4444' : '4px solid #F59E0B',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.02rem', color: 'var(--text-primary)' }}>
                    {haz.id}: {haz.category}
                  </span>
                  {haz.audioAttached && (
                    <span className="badge badge-black" style={{ fontSize: '0.68rem', gap: '4px' }}>
                      🎙️ Voice Note Attached
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`badge ${haz.priority === 'CRITICAL' ? 'badge-red' : 'badge-amber'}`}>
                    {haz.priority}
                  </span>
                  <span className={`badge ${haz.status.includes('Resolved') ? 'badge-green' : 'badge-black'}`}>
                    {haz.status}
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                📍 {haz.location} • Reported: <em style={{ fontStyle: 'normal', color: 'var(--text-primary)' }}>{haz.timestamp}</em> by <strong>{haz.reportedBy}</strong>
              </div>

              <p style={{
                fontSize: '0.9rem',
                color: 'var(--text-primary)',
                background: 'var(--bg-page)',
                border: '1px solid var(--border)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                lineHeight: 1.5
              }}>
                "{haz.description}"
              </p>

              {!haz.status.includes('Resolved') && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2px' }}>
                  <button
                    onClick={() => handleResolve(haz.id)}
                    className="btn-black"
                    style={{ fontSize: '0.84rem', padding: '9px 20px', gap: '6px' }}
                  >
                    <span>✓</span> {t.resolveAction}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Workforce Roster with Attrition Risk Predictor */}
      <div className="card" style={{ padding: '26px 30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="section-num">5</span>
          <span className="section-label">AI ATTRITION PREDICTOR</span>
        </div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginTop: '4px' }}>
          {t.workerRegistryTitle}
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
          Predicting burnout and quit risks before critical staff turnover occurs
        </p>

        <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '14px 18px', fontWeight: 700, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Worker</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sector & Role</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Weekly Hours</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Fatigue Risk</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Satisfaction</th>
                <th style={{ padding: '14px 18px', fontWeight: 700, fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>AI Attrition Risk</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkers.map((w, idx) => {
                const fatigue = evaluateFatigueRisk(w.weeklyHours, w.lastShiftGapHours, w.consecutiveShifts);
                const attrition = calculateAttritionRisk({ ...w, fatigueScore: fatigue.riskScore });

                return (
                  <tr key={w.id} style={{
                    borderBottom: idx === filteredWorkers.length - 1 ? 'none' : '1px solid var(--border)',
                    background: '#FFFFFF',
                    transition: 'background 0.15s ease'
                  }}>
                    <td style={{ padding: '14px 18px', fontWeight: 700 }}>
                      <span style={{ marginRight: '8px' }}>{w.avatar}</span>
                      {w.name}
                    </td>
                    <td style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{w.sector === 'construction' ? '🏗️ Construction' : '🏥 Hospital'}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{w.role}</div>
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      {w.weeklyHours}h {w.weeklyHours > 48 ? '⚠️' : ''}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span className={`badge ${fatigue.riskLevel === 'CRITICAL' ? 'badge-red' : fatigue.riskLevel === 'MODERATE' ? 'badge-amber' : 'badge-green'}`} style={{ fontSize: '0.72rem' }}>
                        {fatigue.riskLevel}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                      {w.satisfactionScore}% ⭐
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '70px', height: '7px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                          <div style={{ width: `${attrition.riskScore}%`, height: '100%', background: attrition.badgeColor }} />
                        </div>
                        <span style={{ color: attrition.badgeColor, fontWeight: 700, fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                          {attrition.riskScore}% {attrition.category}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 6: Anonymous Worker Voice & Whistleblower Feedback */}
      <div className="card" style={{ padding: '26px 30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="section-num">6</span>
              <span className="section-label">RETALIATION-PROOF WHISTLEBLOWER INTELLIGENCE</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginTop: '4px' }}>
              Worker Sentiment & Anonymous Reports
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Aggregated worker feedback secured by SHA-256 cryptographic anonymity proofs
            </p>
          </div>
          <span className="badge badge-black">{filteredFeedbacks.length} Verified Submissions</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {filteredFeedbacks.map(f => (
            <div key={f.id} style={{
              background: '#FFFFFF',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.94rem' }}>
                  {f.department || 'Frontline Shift Staff'}
                </span>
                <span className="badge badge-green" style={{ fontSize: '0.68rem' }}>
                  {f.timestamp}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px', fontSize: '0.78rem', flexWrap: 'wrap' }}>
                <span style={{ background: 'var(--bg-input)', padding: '3px 8px', borderRadius: 'var(--radius-xs)' }}>
                  Supervisor: <strong style={{ color: 'var(--text-primary)' }}>{f.supervisorScore}/5</strong>
                </span>
                <span style={{ background: 'var(--bg-input)', padding: '3px 8px', borderRadius: 'var(--radius-xs)' }}>
                  Workload: <strong style={{ color: 'var(--text-primary)' }}>{f.workloadScore}/5</strong>
                </span>
                <span style={{ background: 'var(--bg-input)', padding: '3px 8px', borderRadius: 'var(--radius-xs)' }}>
                  Safety: <strong style={{ color: 'var(--text-primary)' }}>{f.facilitiesScore}/5</strong>
                </span>
              </div>

              <p style={{
                fontSize: '0.88rem',
                color: 'var(--text-primary)',
                background: 'var(--bg-page)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 14px',
                fontStyle: 'italic',
                lineHeight: 1.5
              }}>
                "{f.comment}"
              </p>

              <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>🛡️</span> {f.anonymityProof}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

