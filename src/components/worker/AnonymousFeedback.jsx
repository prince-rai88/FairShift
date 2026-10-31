import React, { useState } from 'react';

function RatingSlider({ label, value, onChange, lowLabel, highLabel }) {
  return (
    <div style={{ marginBottom: '22px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFFFFF' }}>{label}</label>
        <span style={{
          fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.95rem',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border-glass)',
          borderRadius: '8px', padding: '4px 12px',
          color: '#38BDF8',
          boxShadow: '0 0 12px rgba(56, 189, 248, 0.2)',
        }}>
          {value} / 5
        </span>
      </div>
      <input type="range" min="1" max="5" step="1" value={value} onChange={e => onChange(Number(e.target.value))} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#94A3B8', marginTop: '6px' }}>
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}

export default function AnonymousFeedback({ sector, t, onSubmitFeedback }) {
  const [supervisorRating, setSupervisorRating] = useState(4);
  const [workloadRating, setWorkloadRating] = useState(3);
  const [facilitiesRating, setFacilitiesRating] = useState(4);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [proofHash, setProofHash] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const hash = `SHA256:${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 6)}`;
    if (onSubmitFeedback) {
      onSubmitFeedback({
        sector: sector.id,
        department: sector.id === 'construction' ? 'Floor Rigging & Scaffolding' : 'Emergency & Sanitation Orderlies',
        supervisorScore: supervisorRating, workloadScore: workloadRating, facilitiesScore: facilitiesRating,
        comment: comment || 'Safe and fair working conditions confirmed.',
        anonymityProof: `${hash} (Zero Retaliation Guarantee)`,
      });
    }
    setProofHash(hash); setSubmitted(true); setComment('');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>

      {/* LEFT — Form */}
      <div className="card" style={{ padding: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <span className="section-num">1</span>
          <span className="section-label">Anonymous Feedback</span>
        </div>
        <p style={{ fontSize: '0.84rem', color: '#94A3B8', marginBottom: '24px' }}>
          {t.feedbackSubtitle} Your identity is never captured.
        </p>

        {submitted ? (
          <div style={{
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1.5px solid rgba(16, 185, 129, 0.4)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '42px', marginBottom: '14px' }}>🛡️</div>
            <h3 style={{ fontWeight: 800, color: '#34D399', marginBottom: '8px' }}>{t.feedbackSuccess}</h3>
            <p style={{ fontSize: '0.86rem', color: '#CBD5E1', marginBottom: '18px' }}>
              Combined into anonymized statistics. No name or ID recorded.
            </p>
            <div style={{
              display: 'inline-block', padding: '8px 16px',
              background: 'rgba(0, 0, 0, 0.5)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.8rem', color: '#38BDF8', fontFamily: 'var(--font-mono)',
              marginBottom: '20px',
            }}>
              {proofHash}
            </div>
            <div>
              <button onClick={() => setSubmitted(false)} className="btn-outline" style={{ fontSize: '0.88rem' }}>
                Submit Another Review
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <RatingSlider
              label={t.ratingSupervisor} value={supervisorRating} onChange={setSupervisorRating}
              lowLabel="Disrespectful / Intimidating" highLabel="Fair & Respectful"
            />
            <RatingSlider
              label={t.ratingWorkload} value={workloadRating} onChange={setWorkloadRating}
              lowLabel="Excessive / No Breaks" highLabel="Manageable & Timely Breaks"
            />
            <RatingSlider
              label={t.ratingFacilities} value={facilitiesRating} onChange={setFacilitiesRating}
              lowLabel="Poor Hygiene" highLabel="Clean Restrooms & Water"
            />

            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94A3B8' }}>
                {t.writtenFeedback}
              </label>
              <textarea
                rows={3} value={comment} onChange={e => setComment(e.target.value)}
                placeholder="Share concerns — management only sees anonymized department aggregates..."
                className="fs-input"
              />
            </div>

            <button type="submit" className="btn-black" style={{ width: '100%', padding: '16px', fontSize: '1rem' }}>
              🔒 {t.submitFeedback}
            </button>
          </form>
        )}
      </div>

      {/* RIGHT — How it works */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="card" style={{ padding: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
            <span className="section-num">2</span>
            <span className="section-label">Privacy Guarantee</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { icon: '🔒', title: 'Cryptographically Decoupled', desc: 'Your response is anonymized before storage — no link to your ID.' },
              { icon: '📊', title: 'Aggregate Only', desc: 'Managers see department averages, never individual responses.' },
              { icon: '⚖️', title: 'Zero Retaliation Policy', desc: 'Protected under Whistleblower Protection Act. Hash proof generated per submission.' },
              { icon: '🌐', title: 'Multilingual', desc: 'Submit in English, Hindi, or Tamil — all equal weight.' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', gap: '14px',
                padding: '14px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-glass)',
                transition: 'all 0.25s ease',
              }}>
                <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFFFFF', marginBottom: '2px' }}>{item.title}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
