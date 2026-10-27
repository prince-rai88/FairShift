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
      <div className="card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-black">EMPLOYER COMMAND CENTER</span>
              <span className="badge badge-green">SDG 8 COMPLIANT</span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              {t.adminTitle}
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {t.adminSubtitle}
            </p>
          </div>

          {/* Sector Cross-Filter Pills */}
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setSectorFilter('all')}
              className={`pill-toggle ${sectorFilter === 'all' ? 'active' : ''}`}
            >
              🌐 All Sectors
            </button>
            <button
              onClick={() => setSectorFilter('construction')}
              className={`pill-toggle ${sectorFilter === 'construction' ? 'active' : ''}`}
            >
              🏗️ Construction Alpha
            </button>
            <button
              onClick={() => setSectorFilter('hospital')}
              className={`pill-toggle ${sectorFilter === 'hospital' ? 'active' : ''}`}
            >
              🏥 St. Jude Hospital
            </button>
          </div>
        </div>

        {resolvedNotice && (
          <div style={{
            marginTop: '16px',
            padding: '12px 18px',
            background: '#DCFCE7',
            border: '1.5px solid #BBF7D0',
            borderRadius: 'var(--radius-md)',
            color: '#15803D',
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
        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="section-label">{t.statTotalWorkers}</span>
            <span style={{ fontSize: '18px' }}>👥</span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '8px', color: 'var(--text-primary)' }}>
            {totalOnSite}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--accent-green)', fontWeight: 600, marginTop: '6px' }}>
            ↑ 98.4% Geofenced Compliance
          </div>
        </div>

        {/* Metric 2 */}
        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="section-label">{t.statAvgHours}</span>
            <span style={{ fontSize: '18px' }}>⏱️</span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '8px', color: 'var(--text-primary)' }}>
            {avgWeeklyHours}h
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            Max 48h/wk per labor act
          </div>
        </div>

        {/* Metric 3: Fatigue Violations */}
        <div className="card" style={{ padding: '20px 24px', borderLeft: '4px solid var(--accent-amber)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="section-label" style={{ color: 'var(--accent-amber)' }}>{t.statFatigueAlerts}</span>
            <span style={{ fontSize: '18px' }}>⚠️</span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '8px', color: 'var(--accent-amber)' }}>
            {fatigueViolations.length} Staff
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            Mandatory recovery relief required
          </div>
        </div>

        {/* Metric 4: Safety Hazards */}
        <div className="card" style={{ padding: '20px 24px', borderLeft: '4px solid var(--accent-red)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="section-label" style={{ color: 'var(--accent-red)' }}>{t.statSafetyIncidents}</span>
            <span style={{ fontSize: '18px' }}>🚨</span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '8px', color: 'var(--accent-red)' }}>
            {openHazardsCount} Open
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            Safety alert protocol active
          </div>
        </div>

        {/* Metric 5: Attrition Risk */}
        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="section-label">{t.statAttritionRisk}</span>
            <span style={{ fontSize: '18px' }}>📉</span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '8px', color: 'var(--accent-blue)' }}>
            {highAttritionWorkers.length} Flagged
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            AI Burnout Index Alert
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
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="section-num">1</span>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                7-Day Attendance & Overtime Hours
              </h3>
            </div>
            <span className="badge badge-black">AUDITED</span>
          </div>

          {/* SVG Area Chart */}
          <div style={{ width: '100%', height: '180px' }}>
            <svg viewBox="0 0 500 160" style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16A34A" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#16A34A" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="#E5E7EB" strokeWidth="1" />
              <line x1="40" y1="60" x2="480" y2="60" stroke="#E5E7EB" strokeWidth="1" />
              <line x1="40" y1="100" x2="480" y2="100" stroke="#E5E7EB" strokeWidth="1" />
              <line x1="40" y1="140" x2="480" y2="140" stroke="#D1D5DB" strokeWidth="1.5" />

              {/* Attendance Standard Area */}
              <polygon
                points="40,140 40,70 110,65 180,50 250,55 320,40 390,45 460,35 460,140"
                fill="url(#areaGradient)"
              />
              <polyline
                points="40,70 110,65 180,50 250,55 320,40 390,45 460,35"
                fill="none"
                stroke="#16A34A"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Overtime Line */}
              <polyline
                points="40,120 110,115 180,95 250,110 320,85 390,90 460,80"
                fill="none"
                stroke="#D97706"
                strokeWidth="2.5"
                strokeDasharray="5,5"
              />

              {/* Axis Labels */}
              <text x="40" y="155" fill="#6B7280" fontSize="11" fontFamily="var(--font-mono)">Mon</text>
              <text x="110" y="155" fill="#6B7280" fontSize="11" fontFamily="var(--font-mono)">Tue</text>
              <text x="180" y="155" fill="#6B7280" fontSize="11" fontFamily="var(--font-mono)">Wed</text>
              <text x="250" y="155" fill="#6B7280" fontSize="11" fontFamily="var(--font-mono)">Thu</text>
              <text x="320" y="155" fill="#6B7280" fontSize="11" fontFamily="var(--font-mono)">Fri</text>
              <text x="390" y="155" fill="#6B7280" fontSize="11" fontFamily="var(--font-mono)">Sat</text>
              <text x="460" y="155" fill="#6B7280" fontSize="11" fontFamily="var(--font-mono)">Sun</text>
            </svg>
          </div>

          <div style={{ display: 'flex', gap: '20px', fontSize: '0.8rem', marginTop: '12px', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#16A34A' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Regular Shift Hours (98.4%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#D97706' }} />
              <span style={{ color: 'var(--text-secondary)' }}>1.5x Overtime Hours</span>
            </div>
          </div>
        </div>

        {/* Sector Comparison Bar Chart */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="section-num">2</span>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                Cross-Sector Health Metrics
              </h3>
            </div>
            <span className="badge badge-black">MULTI-INDUSTRY</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Construction Metric */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600 }}>🏗️ Construction Site Alpha</span>
                <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>Avg 42h/wk (Fatigue: 42%)</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '42%', height: '100%', background: 'var(--accent-green)', borderRadius: '4px' }} />
              </div>
            </div>

            {/* Hospital Metric */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600 }}>🏥 St. Jude Metro Hospital</span>
                <span style={{ color: 'var(--accent-amber)', fontWeight: 700 }}>Avg 50.5h/wk (Fatigue: 58% Warning)</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '58%', height: '100%', background: 'var(--accent-amber)', borderRadius: '4px' }} />
              </div>
            </div>

            {/* Satisfaction Index */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginTop: '8px',
              padding: '14px',
              background: 'var(--bg-input)',
              border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius-md)'
            }}>
              <div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Construction Sentiment</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-green)', marginTop: '2px' }}>85% Favorable</div>
              </div>
              <div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Hospital Sentiment</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-red)', marginTop: '2px' }}>54% Needs Relief</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Feature 6: Anti-Fatigue & Overwork Radar */}
      <div className="card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="section-num">3</span>
              <span className="section-label">AUTOMATED LABOR LAW ENFORCER</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginTop: '4px' }}>
              {t.fatigueRadarTitle}
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
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
                background: isFlagged ? '#FFFBEB' : 'var(--bg-input)',
                border: isFlagged ? '1.5px solid #FDE68A' : '1.5px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ fontSize: '26px' }}>{w.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.96rem' }}>{w.name} <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>({w.id})</span></div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {w.role} • <strong>{w.weeklyHours}h worked this week</strong> • Last turnaround gap: <strong>{w.lastShiftGapHours}h</strong>
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
                      style={{ fontSize: '0.8rem', padding: '8px 14px' }}
                    >
                      🛡️ Dispatch Relief Rest
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.82rem', color: 'var(--accent-green)', fontWeight: 600 }}>✓ Shift Compliant</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Safety Hazard Triage Desk */}
      <div className="card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="section-num">4</span>
              <span className="section-label">EMERGENCY PRIORITY QUEUE</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginTop: '4px' }}>
              {t.incidentTriageTitle}
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Live worker voice & text safety alerts with emergency priority resolution
            </p>
          </div>
          <span className="badge badge-red">{openHazardsCount} Hazards Actionable</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredHazards.map(haz => (
            <div key={haz.id} style={{
              padding: '18px',
              background: haz.status.includes('Resolved') ? '#F0FDF4' : '#FEF2F2',
              border: haz.status.includes('Resolved') ? '1.5px solid #BBF7D0' : '1.5px solid #FECACA',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.02rem', color: 'var(--text-primary)' }}>
                    {haz.id}: {haz.category}
                  </span>
                  {haz.audioAttached && (
                    <span className="badge badge-black" style={{ fontSize: '0.7rem' }}>
                      🎙️ Audio Attached
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
                📍 {haz.location} • Reported: <em>{haz.timestamp}</em> by <strong>{haz.reportedBy}</strong>
              </div>

              <p style={{
                fontSize: '0.88rem',
                color: 'var(--text-primary)',
                background: '#FFFFFF',
                border: '1px solid var(--border)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)'
              }}>
                "{haz.description}"
              </p>

              {!haz.status.includes('Resolved') && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <button
                    onClick={() => handleResolve(haz.id)}
                    className="btn-black"
                    style={{ fontSize: '0.82rem', padding: '8px 18px' }}
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
      <div className="card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="section-num">5</span>
          <span className="section-label">AI ATTRITION PREDICTOR</span>
        </div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginTop: '4px' }}>
          {t.workerRegistryTitle}
        </h2>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Predicting burnout and quit risks before critical staff turnover occurs
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid var(--border)', color: 'var(--text-secondary)' }}>
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
                  <tr key={w.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px', fontWeight: 700 }}>
                      <span style={{ marginRight: '8px' }}>{w.avatar}</span>
                      {w.name}
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                      <div>{w.sector === 'construction' ? '🏗️ Construction' : '🏥 Hospital'}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{w.role}</div>
                    </td>
                    <td style={{ padding: '12px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                      {w.weeklyHours}h {w.weeklyHours > 48 ? '⚠️' : ''}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span className={`badge ${fatigue.riskLevel === 'CRITICAL' ? 'badge-red' : fatigue.riskLevel === 'MODERATE' ? 'badge-amber' : 'badge-green'}`} style={{ fontSize: '0.72rem' }}>
                        {fatigue.riskLevel}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontWeight: 600 }}>
                      {w.satisfactionScore}% ⭐
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '60px', height: '6px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
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
