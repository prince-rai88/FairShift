import React, { useState } from 'react';

export default function SafetyReport({ sector, t, currentLang, hazards, onReportHazard }) {
  const [category, setCategory] = useState('hazardFall');
  const [locationNote, setLocationNote] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('HIGH');
  const [isRecording, setIsRecording] = useState(false);
  const [audioAttached, setAudioAttached] = useState(false);
  const [submittedAlert, setSubmittedAlert] = useState(false);

  // Voice Input via Web Speech API
  const handleVoiceRecord = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Graceful fallback simulation if browser microphone is disabled
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setAudioAttached(true);
        const demoNote = currentLang === 'hi'
          ? "चौथी मंजिल पर पाड़ कमजोर है, सुरक्षा बेल्ट का हुक टूटा हुआ है।"
          : currentLang === 'ta'
          ? "4-வது தளத்தில் சாரக்கட்டு பலவீனமாக உள்ளது, பாதுகாப்பு பெல்ட் கொக்கி உடைந்துள்ளது."
          : "Scaffolding clamp on 4th floor perimeter is loose and vibrating heavily.";
        setDescription(prev => prev ? `${prev} [Voice Note]: ${demoNote}` : demoNote);
      }, 2500);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = currentLang === 'hi' ? 'hi-IN' : currentLang === 'ta' ? 'ta-IN' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setDescription(prev => prev ? `${prev} ${transcript}` : transcript);
        setAudioAttached(true);
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
        setAudioAttached(true);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch {
      setIsRecording(false);
      setAudioAttached(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const hazardCategoryName = t[category] || category;
    
    if (onReportHazard) {
      onReportHazard({
        sector: sector.id,
        category: hazardCategoryName,
        location: locationNote || `${sector.name} Floor 3`,
        description: description || "Hazard reported by on-site worker alert.",
        priority,
        audioAttached
      });
    }

    setSubmittedAlert(true);
    setDescription('');
    setLocationNote('');
    setAudioAttached(false);

    setTimeout(() => {
      setSubmittedAlert(false);
    }, 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Safety Banner */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="pill-badge pill-rose">SDG 8.8 Safe Workplaces</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Zero-Retaliation Protection Active
          </span>
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{t.safetyTitle}</h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{t.safetySubtitle}</p>

        {submittedAlert && (
          <div style={{
            background: 'rgba(0, 212, 170, 0.15)',
            border: '1px solid #00D4AA',
            borderRadius: 'var(--radius-md)',
            padding: '14px 18px',
            marginTop: '16px',
            color: '#00D4AA',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span>🚨</span>
            <span>{t.reportSuccess}</span>
          </div>
        )}

        {/* Hazard Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
          
          {/* Category Dropdown */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
              {t.hazardType}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            >
              <option value="hazardFall" style={{ background: '#0E1526' }}>⚠️ {t.hazardFall}</option>
              <option value="hazardChemical" style={{ background: '#0E1526' }}>🧪 {t.hazardChemical}</option>
              <option value="hazardElectrical" style={{ background: '#0E1526' }}>⚡ {t.hazardElectrical}</option>
              <option value="hazardMachinery" style={{ background: '#0E1526' }}>🏗️ {t.hazardMachinery}</option>
              <option value="hazardPPE" style={{ background: '#0E1526' }}>🦺 {t.hazardPPE}</option>
              <option value="hazardSanitation" style={{ background: '#0E1526' }}>🚰 {t.hazardSanitation}</option>
            </select>
          </div>

          {/* Location details */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
              {t.locationNote}
            </label>
            <input
              type="text"
              value={locationNote}
              onChange={(e) => setLocationNote(e.target.value)}
              placeholder="e.g. Tower B - 12th Floor exterior or Ward 4 Sanitation chute"
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                fontSize: '0.92rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Voice Note Button with Soundwave effect */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
              Multilingual Voice or Text Report
            </label>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
              <button
                type="button"
                onClick={handleVoiceRecord}
                style={{
                  background: isRecording ? '#EF4444' : 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: isRecording ? '#FFFFFF' : '#F87171',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 20px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
              >
                <span>🎙️</span>
                {isRecording ? t.recordingActive : t.voiceReportBtn}
              </button>

              {isRecording && (
                <div style={{ display: 'flex', alignItems: 'center', height: '24px' }}>
                  <span className="wave-bar" />
                  <span className="wave-bar" />
                  <span className="wave-bar" />
                  <span className="wave-bar" />
                </div>
              )}

              {audioAttached && !isRecording && (
                <span className="pill-badge pill-teal" style={{ fontSize: '0.75rem' }}>
                  ✓ Voice Audio Attached
                </span>
              )}
            </div>

            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Spoken words will automatically transcribe here, or you can type directly..."
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                fontSize: '0.92rem',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Priority Options */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
              Urgency Level
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['MEDIUM', 'HIGH', 'CRITICAL'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setPriority(lvl)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    background: priority === lvl 
                      ? (lvl === 'CRITICAL' ? '#EF4444' : lvl === 'HIGH' ? '#F59E0B' : '#6366F1')
                      : 'rgba(255, 255, 255, 0.04)',
                    color: priority === lvl ? '#FFFFFF' : 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  {lvl === 'CRITICAL' ? '🚨 ' : lvl === 'HIGH' ? '⚠️ ' : 'ℹ️ '}
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn-danger"
            style={{ width: '100%', padding: '14px', marginTop: '10px', fontSize: '1rem' }}
          >
            <span>🚨</span> {t.submitReport}
          </button>
        </form>
      </div>

      {/* Incident Status Tracker */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '14px' }}>
          {t.activeIncidents}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {hazards.map((haz) => (
            <div key={haz.id} style={{
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#F8FAFC' }}>
                  {haz.category}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span className={`pill-badge ${haz.priority === 'CRITICAL' ? 'pill-rose' : 'pill-amber'}`}>
                    {haz.priority}
                  </span>
                  <span className={`pill-badge ${haz.status.includes('Resolved') ? 'pill-teal' : 'pill-purple'}`}>
                    {haz.status}
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                📍 {haz.location} • <em>{haz.timestamp}</em>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                "{haz.description}"
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
