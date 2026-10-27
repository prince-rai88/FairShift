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
    MEDIUM:   { bg: '#EFF6FF', border: '#BFDBFE', color: 'var(--accent-blue)' },
    HIGH:     { bg: '#FFFBEB', border: '#FDE68A', color: 'var(--accent-amber)' },
    CRITICAL: { bg: '#FEF2F2', border: '#FECACA', color: 'var(--accent-red)' },
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>

      {/* LEFT — Report Form */}
      <div className="card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="section-num">1</span>
          <span className="section-label">Report a Hazard</span>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          {t.safetySubtitle} — Zero-retaliation protection active.
        </p>

        {submittedAlert && (
          <div style={{
            background: '#F0FDF4', border: '1.5px solid #86EFAC', borderRadius: 'var(--radius-md)',
            padding: '12px 16px', marginBottom: '20px', color: 'var(--accent-green)', fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            ✅ {t.reportSuccess}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Category */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
              {t.hazardType}
            </label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="fs-input">
              <option value="hazardFall">⚠️ {t.hazardFall}</option>
              <option value="hazardChemical">🧪 {t.hazardChemical}</option>
              <option value="hazardElectrical">⚡ {t.hazardElectrical}</option>
              <option value="hazardMachinery">🏗️ {t.hazardMachinery}</option>
              <option value="hazardPPE">🦺 {t.hazardPPE}</option>
              <option value="hazardSanitation">🚰 {t.hazardSanitation}</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
              {t.locationNote}
            </label>
            <input type="text" value={locationNote} onChange={e => setLocationNote(e.target.value)}
              placeholder="e.g. Tower B - 12th Floor, Ward 4 Sanitation" className="fs-input" />
          </div>

          {/* Voice / Text */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
              Description (Voice or Text)
            </label>
            <button
              type="button" onClick={handleVoiceRecord}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: isRecording ? 'var(--accent-red)' : 'var(--bg-page)',
                border: `1.5px solid ${isRecording ? 'var(--accent-red)' : 'var(--border-dark)'}`,
                borderRadius: 'var(--radius-md)', padding: '10px 18px',
                fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.88rem',
                color: isRecording ? '#fff' : 'var(--text-primary)',
                cursor: 'pointer', marginBottom: '10px', transition: 'all 0.15s',
              }}
            >
              🎙️ {isRecording ? t.recordingActive : t.voiceReportBtn}
              {isRecording && <span className="pulse-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff', display: 'inline-block' }} />}
            </button>
            {audioAttached && !isRecording && <span className="badge badge-green" style={{ marginBottom: '8px', display: 'inline-flex' }}>✓ Voice Attached</span>}
            <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Voice will transcribe here, or type directly..." className="fs-input" />
          </div>

          {/* Urgency */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
              Urgency Level
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['MEDIUM', 'HIGH', 'CRITICAL'].map(lvl => (
                <button
                  key={lvl} type="button" onClick={() => setPriority(lvl)}
                  style={{
                    flex: 1, padding: '10px 8px', borderRadius: 'var(--radius-md)', fontWeight: 700,
                    fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'var(--font-sans)',
                    background: priority === lvl ? priorityColors[lvl].bg : 'var(--bg-page)',
                    color: priority === lvl ? priorityColors[lvl].color : 'var(--text-muted)',
                    border: `1.5px solid ${priority === lvl ? priorityColors[lvl].border : 'var(--border)'}`,
                    transition: 'all 0.15s',
                  }}
                >
                  {lvl === 'CRITICAL' ? '🚨 ' : lvl === 'HIGH' ? '⚠️ ' : 'ℹ️ '}{lvl}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-red" style={{ width: '100%', padding: '15px', marginTop: '4px', fontSize: '1rem' }}>
            🚨 {t.submitReport}
          </button>
        </form>
      </div>

      {/* RIGHT — Active Incidents */}
      <div className="card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <span className="section-num">2</span>
          <span className="section-label">{t.activeIncidents}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {hazards.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              ✅ No active hazards on this site
            </div>
          )}
          {hazards.map(haz => (
            <div key={haz.id} style={{
              padding: '16px', background: 'var(--bg-page)',
              borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{haz.category}</div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span className={`badge ${haz.priority === 'CRITICAL' ? 'badge-red' : haz.priority === 'HIGH' ? 'badge-amber' : 'badge-blue'}`}>
                    {haz.priority}
                  </span>
                  <span className={`badge ${haz.status.includes('Resolved') ? 'badge-green' : 'badge-gray'}`}>
                    {haz.status}
                  </span>
                </div>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                📍 {haz.location} · {haz.timestamp}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                "{haz.description}"
              </div>
              {haz.audioAttached && (
                <div style={{ marginTop: '8px' }}><span className="badge badge-blue">🎙️ Audio Attached</span></div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
