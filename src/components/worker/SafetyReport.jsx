import React, { useState } from 'react';

export default function SafetyReport({ sector, t, currentLang, hazards, onReportHazard }) {
  const [category, setCategory] = useState('hazardFall');
  const [locationNote, setLocationNote] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('HIGH');
  const [isRecording, setIsRecording] = useState(false);
  const [audioAttached, setAudioAttached] = useState(false);
  const [submittedAlert, setSubmittedAlert] = useState(false);

  const handleVoiceRecord = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false); setAudioAttached(true);
        const demo = "Scaffolding clamp on 4th floor perimeter is loose and vibrating heavily.";
        setDescription(prev => prev ? `${prev} [Voice Note]: ${demo}` : demo);
      }, 2500);
      return;
    }
    try {
      const r = new SpeechRecognition();
      r.lang = currentLang === 'hi' ? 'hi-IN' : currentLang === 'ta' ? 'ta-IN' : 'en-US';
      r.onstart = () => setIsRecording(true);
      r.onresult = (e) => { setDescription(p => p ? `${p} ${e.results[0][0].transcript}` : e.results[0][0].transcript); setAudioAttached(true); setIsRecording(false); };
      r.onerror = () => { setIsRecording(false); setAudioAttached(true); };
      r.onend = () => setIsRecording(false);
      r.start();
    } catch { setIsRecording(false); setAudioAttached(true); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const hazardCategoryName = t[category] || category;
    if (onReportHazard) {
      onReportHazard({ sector: sector.id, category: hazardCategoryName, location: locationNote || `${sector.name} Floor 3`, description: description || 'Hazard reported by on-site worker.', priority, audioAttached });
    }
    setSubmittedAlert(true); setDescription(''); setLocationNote(''); setAudioAttached(false);
    setTimeout(() => setSubmittedAlert(false), 4000);
  };

  const priorityColors = {
    MEDIUM:   { bg: 'rgba(59, 130, 246, 0.18)', border: 'rgba(59, 130, 246, 0.45)', color: '#60A5FA' },
    HIGH:     { bg: 'rgba(245, 158, 11, 0.18)', border: 'rgba(245, 158, 11, 0.45)', color: '#FBBF24' },
    CRITICAL: { bg: 'rgba(239, 68, 68, 0.22)', border: 'rgba(239, 68, 68, 0.5)', color: '#F87171' },
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>

      {/* LEFT — Report Form */}
      <div className="card" style={{ padding: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <span className="section-num">1</span>
          <span className="section-label">Report a Hazard</span>
        </div>
        <p style={{ fontSize: '0.84rem', color: '#94A3B8', marginBottom: '24px' }}>
          {t.safetySubtitle} — Zero-retaliation protection active.
        </p>

        {submittedAlert && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1.5px solid rgba(16, 185, 129, 0.4)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 18px',
            marginBottom: '20px',
            color: '#34D399',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            ✅ {t.reportSuccess}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

          {/* Category */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94A3B8' }}>
              {t.hazardType}
            </label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="fs-input">
              <option value="hazardFall" style={{ background: '#0B132B' }}>⚠️ {t.hazardFall}</option>
              <option value="hazardChemical" style={{ background: '#0B132B' }}>🧪 {t.hazardChemical}</option>
              <option value="hazardElectrical" style={{ background: '#0B132B' }}>⚡ {t.hazardElectrical}</option>
              <option value="hazardMachinery" style={{ background: '#0B132B' }}>🏗️ {t.hazardMachinery}</option>
              <option value="hazardPPE" style={{ background: '#0B132B' }}>🦺 {t.hazardPPE}</option>
              <option value="hazardSanitation" style={{ background: '#0B132B' }}>🚰 {t.hazardSanitation}</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94A3B8' }}>
              {t.locationNote}
            </label>
            <input type="text" value={locationNote} onChange={e => setLocationNote(e.target.value)}
              placeholder="e.g. Tower B - 12th Floor, Ward 4 Sanitation" className="fs-input" />
          </div>

          {/* Voice / Text */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94A3B8' }}>
              Description (Voice or Text)
            </label>
            <button
              type="button" onClick={handleVoiceRecord}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: isRecording ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                border: `1.5px solid ${isRecording ? 'rgba(239, 68, 68, 0.6)' : 'var(--border-glass)'}`,
                borderRadius: 'var(--radius-md)', padding: '10px 18px',
                fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.88rem',
                color: isRecording ? '#FCA5A5' : '#F1F5F9',
                cursor: 'pointer', marginBottom: '10px', transition: 'all 0.2s',
              }}
            >
              🎙️ {isRecording ? t.recordingActive : t.voiceReportBtn}
              {isRecording && <span className="pulse-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />}
            </button>
            {audioAttached && !isRecording && <span className="badge badge-green" style={{ marginBottom: '8px', display: 'inline-flex' }}>✓ Voice Attached</span>}
            <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Voice will transcribe here, or type directly..." className="fs-input" />
          </div>

          {/* Urgency */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94A3B8' }}>
              Urgency Level
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['MEDIUM', 'HIGH', 'CRITICAL'].map(lvl => (
                <button
                  key={lvl} type="button" onClick={() => setPriority(lvl)}
                  style={{
                    flex: 1, padding: '12px 8px', borderRadius: 'var(--radius-md)', fontWeight: 700,
                    fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'var(--font-sans)',
                    background: priority === lvl ? priorityColors[lvl].bg : 'rgba(255, 255, 255, 0.03)',
                    color: priority === lvl ? priorityColors[lvl].color : 'var(--text-muted)',
                    border: `1px solid ${priority === lvl ? priorityColors[lvl].border : 'var(--border-glass)'}`,
                    transition: 'all 0.2s',
                  }}
                >
                  {lvl === 'CRITICAL' ? '🚨 ' : lvl === 'HIGH' ? '⚠️ ' : 'ℹ️ '}{lvl}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-red" style={{ width: '100%', padding: '16px', marginTop: '6px', fontSize: '1rem' }}>
            🚨 {t.submitReport}
          </button>
        </form>
      </div>

      {/* RIGHT — Active Incidents */}
      <div className="card" style={{ padding: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
          <span className="section-num">2</span>
          <span className="section-label">{t.activeIncidents}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {hazards.length === 0 && (
            <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              ✅ No active hazards on this site
            </div>
          )}
          {hazards.map(haz => (
            <div key={haz.id} style={{
              padding: '18px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-glass)',
              transition: 'all 0.25s ease',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFFFFF' }}>{haz.category}</div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span className={`badge ${haz.priority === 'CRITICAL' ? 'badge-red' : haz.priority === 'HIGH' ? 'badge-amber' : 'badge-blue'}`}>
                    {haz.priority}
                  </span>
                  <span className={`badge ${haz.status.includes('Resolved') ? 'badge-green' : 'badge-blue'}`}>
                    {haz.status}
                  </span>
                </div>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '8px' }}>
                📍 {haz.location} · {haz.timestamp}
              </div>
              <div style={{ fontSize: '0.84rem', color: '#E2E8F0', fontStyle: 'italic' }}>
                "{haz.description}"
              </div>
              {haz.audioAttached && (
                <div style={{ marginTop: '10px' }}><span className="badge badge-blue">🎙️ Audio Attached</span></div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
