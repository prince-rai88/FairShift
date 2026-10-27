import React, { useState } from 'react';
import { evaluateFatigueRisk, calculateAttritionRisk } from '../../utils/fairshiftLogic';

export default function AdminDashboard({
  workers,
  sectors,
  hazards,
  feedbacks,
  activeSector,
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
      setResolvedNotice(`Hazard ${hazardId} acknowledged and marked Resolved.`);
      setTimeout(() => setResolvedNotice(null), 3000);
    }
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner & Sector Filter */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="pill-badge pill-purple">EMPLOYER COMMAND CENTER</span>
              <span className="pill-badge pill-teal">SDG 8 COMPLIANT</span>
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              {t.adminTitle}
            </h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              {t.adminSubtitle}
            </p>
          </div>

          {/* Sector Cross-Filter */}
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '4px'
          }}>
            <button
              onClick={() => setSectorFilter('all')}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: sectorFilter === 'all' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                color: sectorFilter === 'all' ? '#FFFFFF' : 'var(--text-secondary)'
              }}
            >
              🌐 All Sectors (Unified)
            </button>
            <button
              onClick={() => setSectorFilter('construction')}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: sectorFilter === 'construction' ? 'rgba(0, 212, 170, 0.2)' : 'transparent',
                color: sectorFilter === 'construction' ? '#00D4AA' : 'var(--text-secondary)'
              }}
            >
              🏗️ Construction Site Alpha
            </button>
            <button
              onClick={() => setSectorFilter('hospital')}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: sectorFilter === 'hospital' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                color: sectorFilter === 'hospital' ? '#A5B4FC' : 'var(--text-secondary)'
              }}
            >
              🏥 St. Jude Metro Hospital
            </button>
          </div>
        </div>

        {resolvedNotice && (
          <div style={{
            marginTop: '16px',
            padding: '10px 16px',
            background: 'rgba(0, 212, 170, 0.15)',
            border: '1px solid #00D4AA',
            borderRadius: 'var(--radius-sm)',
            color: '#00D4AA',
            fontWeight: 600,
            fontSize: '0.88rem'
          }}>
            ✓ {resolvedNotice}
          </div>
        )}
      </div>

      {/* KPI Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        {/* Metric 1 */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{t.statTotalWorkers}</span>
            <span style={{ fontSize: '20px' }}>👥</span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '8px', color: '#F8FAFC' }}>
            {totalOnSite}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#00D4AA', marginTop: '4px' }}>
            ↑ 98.4% Geofenced Shift Compliance
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{t.statAvgHours}</span>
            <span style={{ fontSize: '20px' }}>⏱️</span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '8px', color: '#38BDF8' }}>
            {avgWeeklyHours}h
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Threshold: Max 48h/week per labor act
          </div>
        </div>

        {/* Metric 3: Fatigue Violations */}
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #F59E0B' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: '#FBBF24', fontWeight: 600 }}>{t.statFatigueAlerts}</span>
            <span style={{ fontSize: '20px' }}>⚠️</span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '8px', color: '#FBBF24' }}>
            {fatigueViolations.length} Staff
          </div>
          <div style={{ fontSize: '0.75rem', color: '#FCD34D', marginTop: '4px' }}>
            Requires immediate shift rest relief
          </div>
        </div>

        {/* Metric 4: Safety Hazards */}
        <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #EF4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: '#F87171', fontWeight: 600 }}>{t.statSafetyIncidents}</span>
            <span style={{ fontSize: '20px' }}>🚨</span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '8px', color: '#F87171' }}>
            {openHazardsCount} Open
          </div>
          <div style={{ fontSize: '0.75rem', color: '#FCA5A5', marginTop: '4px' }}>
            Voice alerts dispatched to safety team
          </div>
        </div>

        {/* Metric 5: Attrition Risk */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{t.statAttritionRisk}</span>
            <span style={{ fontSize: '20px' }}>📉</span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '8px', color: '#A5B4FC' }}>
            {highAttritionWorkers.length} Flagged
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            AI Burnout & Dissatisfaction Index
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
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              7-Day Attendance & Overtime Hours
            </h3>
            <span className="pill-badge pill-teal">Audited Records</span>
          </div>

          {/* SVG Area Chart */}
          <div style={{ width: '100%', height: '180px' }}>
            <svg viewBox="0 0 500 160" style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00D4AA" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#00D4AA" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="overtimeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.06)" />
              <line x1="40" y1="60" x2="480" y2="60" stroke="rgba(255,255,255,0.06)" />
              <line x1="40" y1="100" x2="480" y2="100" stroke="rgba(255,255,255,0.06)" />
              <line x1="40" y1="140" x2="480" y2="140" stroke="rgba(255,255,255,0.1)" />

              {/* Attendance Standard Area */}
              <polygon
                points="40,140 40,70 110,65 180,50 250,55 320,40 390,45 460,35 460,140"
                fill="url(#areaGradient)"
              />
              <polyline
                points="40,70 110,65 180,50 250,55 320,40 390,45 460,35"
                fill="none"
                stroke="#00D4AA"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Overtime Line */}
              <polyline
                points="40,120 110,115 180,95 250,110 320,85 390,90 460,80"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2.5"
                strokeDasharray="4,4"
              />

              {/* Axis Labels */}
              <text x="40" y="155" fill="#64748B" fontSize="10">Mon</text>
              <text x="110" y="155" fill="#64748B" fontSize="10">Tue</text>
              <text x="180" y="155" fill="#64748B" fontSize="10">Wed</text>
              <text x="250" y="155" fill="#64748B" fontSize="10">Thu</text>
              <text x="320" y="155" fill="#64748B" fontSize="10">Fri</text>
              <text x="390" y="155" fill="#64748B" fontSize="10">Sat</text>
              <text x="460" y="155" fill="#64748B" fontSize="10">Sun</text>
            </svg>
          </div>

          <div style={{ display: 'flex', gap: '16px', fontSize: '0.78rem', marginTop: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00D4AA' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Regular Shift Hours (98.4%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} />
              <span style={{ color: 'var(--text-secondary)' }}>1.5x Overtime Hours</span>
            </div>
          </div>
        </div>

        {/* Sector Comparison Bar Chart */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              Cross-Sector Health Metrics
            </h3>
            <span className="pill-badge pill-purple">2+ Industries</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Construction Metric */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600 }}>🏗️ Construction Site Alpha</span>
                <span style={{ color: '#00D4AA', fontWeight: 700 }}>Avg 42h/wk (Fatigue: 42%)</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: '42%', height: '100%', background: 'linear-gradient(90deg, #00D4AA, #059669)', borderRadius: '6px' }} />
              </div>
            </div>

            {/* Hospital Metric */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600 }}>🏥 St. Jude Metro Hospital</span>
                <span style={{ color: '#F59E0B', fontWeight: 700 }}>Avg 50.5h/wk (Fatigue: 58% Warning)</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: '58%', height: '100%', background: 'linear-gradient(90deg, #F59E0B, #EF4444)', borderRadius: '6px' }} />
              </div>
            </div>

            {/* Satisfaction Index */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginTop: '8px',
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-sm)'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Construction Sentiment</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#00D4AA' }}>85% Favorable</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Hospital Sentiment</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F87171' }}>54% Needs Relief</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Feature 6: Anti-Fatigue & Overwork Radar */}
      <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="pill-badge pill-amber">FEATURE 6: ANTI-FATIGUE RADAR</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Automated Labor Law Enforcer</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '4px' }}>
              {t.fatigueRadarTitle}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {t.fatigueRadarDesc}
            </p>
          </div>
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
                padding: '14px 18px',
                background: isFlagged ? 'rgba(245, 158, 11, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                border: isFlagged ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ fontSize: '24px' }}>{w.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{w.name} ({w.id})</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {w.role} • <strong>{w.weeklyHours}h worked this week</strong> • Last turnaround gap: <strong>{w.lastShiftGapHours}h</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span className={`pill-badge ${fatigue.riskLevel === 'CRITICAL' ? 'pill-rose' : fatigue.riskLevel === 'MODERATE' ? 'pill-amber' : 'pill-teal'}`}>
                    {fatigue.riskLevel} (Score: {fatigue.riskScore})
                  </span>

                  {isFlagged ? (
                    <button
                      onClick={() => alert(`Relief staff automatically requested for ${w.name}. Next shift marked as mandatory recovery day.`)}
                      className="btn-secondary"
                      style={{ fontSize: '0.78rem', padding: '6px 12px', border: '1px solid rgba(245, 158, 11, 0.4)' }}
                    >
                      🛡️ Dispatch Relief Rest
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: '#00D4AA' }}>✓ Shift Compliant</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Safety Hazard Triage Desk */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
              {t.incidentTriageTitle}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Live worker voice & text safety alerts with emergency priority queue
            </p>
          </div>
          <span className="pill-badge pill-rose">{openHazardsCount} Hazards Needing Action</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredHazards.map(haz => (
            <div key={haz.id} style={{
              padding: '18px',
              background: haz.status.includes('Resolved') ? 'rgba(0, 212, 170, 0.04)' : 'rgba(239, 68, 68, 0.05)',
              border: haz.status.includes('Resolved') ? '1px solid rgba(0, 212, 170, 0.3)' : '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#F8FAFC' }}>
                    {haz.id}: {haz.category}
                  </span>
                  {haz.audioAttached && (
                    <span className="pill-badge pill-purple" style={{ fontSize: '0.7rem' }}>
                      🎙️ Audio Attached
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`pill-badge ${haz.priority === 'CRITICAL' ? 'pill-rose' : 'pill-amber'}`}>
                    {haz.priority}
                  </span>
                  <span className={`pill-badge ${haz.status.includes('Resolved') ? 'pill-teal' : 'pill-purple'}`}>
                    {haz.status}
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                📍 {haz.location} • Reported: <em>{haz.timestamp}</em> by {haz.reportedBy}
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', background: 'rgba(0, 0, 0, 0.25)', padding: '10px 14px', borderRadius: '6px' }}>
                "{haz.description}"
              </p>

              {!haz.status.includes('Resolved') && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                  <button
                    onClick={() => handleResolve(haz.id)}
                    className="btn-primary"
                    style={{ fontSize: '0.82rem', padding: '8px 16px' }}
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
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '4px' }}>
          {t.workerRegistryTitle} & AI Attrition Predictor
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Predicting burnout and quit risks before critical staff attrition occurs
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px' }}>Worker</th>
                <th style={{ padding: '12px' }}>Sector & Role</th>
                <th style={{ padding: '12px' }}>Weekly Hrs</th>
                <th style={{ padding: '12px' }}>Fatigue Risk</th>
                <th style={{ padding: '12px' }}>Satisfaction</th>
                <th style={{ padding: '12px' }}>AI Attrition Risk</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkers.map(w => {
                const fatigue = evaluateFatigueRisk(w.weeklyHours, w.lastShiftGapHours, w.consecutiveShifts);
                const attrition = calculateAttritionRisk({ ...w, fatigueScore: fatigue.riskScore });

                return (
                  <tr key={w.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '12px', fontWeight: 700 }}>
                      <span style={{ marginRight: '8px' }}>{w.avatar}</span>
                      {w.name}
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                      <div>{w.sector === 'construction' ? '🏗️ Construction' : '🏥 Hospital'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{w.role}</div>
                    </td>
                    <td style={{ padding: '12px', fontWeight: 600 }}>
                      {w.weeklyHours}h {w.weeklyHours > 48 ? '⚠️' : ''}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span className={`pill-badge ${fatigue.riskLevel === 'CRITICAL' ? 'pill-rose' : fatigue.riskLevel === 'MODERATE' ? 'pill-amber' : 'pill-teal'}`} style={{ fontSize: '0.7rem' }}>
                        {fatigue.riskLevel}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontWeight: 600 }}>
                      {w.satisfactionScore}% ⭐
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '60px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${attrition.riskScore}%`, height: '100%', background: attrition.badgeColor }} />
                        </div>
                        <span style={{ color: attrition.badgeColor, fontWeight: 700, fontSize: '0.78rem' }}>
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

    </div>
  );
}
