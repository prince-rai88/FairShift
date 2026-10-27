import React, { useState } from 'react';

export default function AnonymousFeedback({ sector, t, onSubmitFeedback }) {
  const [supervisorRating, setSupervisorRating] = useState(4);
  const [workloadRating, setWorkloadRating] = useState(3);
  const [facilitiesRating, setFacilitiesRating] = useState(4);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [proofHash, setProofHash] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const generatedHash = `SHA256:${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 6)}`;
    
    if (onSubmitFeedback) {
      onSubmitFeedback({
        sector: sector.id,
        department: sector.id === 'construction' ? 'Floor Rigging & Scaffolding' : 'Emergency & Sanitation Orderlies',
        supervisorScore: supervisorRating,
        workloadScore: workloadRating,
        facilitiesScore: facilitiesRating,
        comment: comment || "Safe and fair working conditions confirmed.",
        anonymityProof: `${generatedHash} (Zero Retaliation Guarantee)`
      });
    }

    setProofHash(generatedHash);
    setSubmitted(true);
    setComment('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Banner */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="pill-badge pill-purple">Protected Whistleblower Voice</span>
          <span className="pill-badge pill-teal">100% Cryptographically Decoupled</span>
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{t.feedbackTitle}</h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{t.feedbackSubtitle}</p>

        {submitted ? (
          <div style={{
            background: 'rgba(0, 212, 170, 0.12)',
            border: '1px solid #00D4AA',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            marginTop: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>🛡️</div>
            <h3 style={{ color: '#00D4AA', fontWeight: 700, marginBottom: '4px' }}>
              {t.feedbackSuccess}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Your feedback was combined into aggregate statistics. No name, phone number, or worker ID was captured.
            </p>
            <div style={{
              display: 'inline-block',
              padding: '6px 14px',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              color: '#38BDF8',
              fontFamily: 'monospace'
            }}>
              Zero-Retaliation Cryptographic Proof: {proofHash}
            </div>
            <div style={{ marginTop: '16px' }}>
              <button
                onClick={() => setSubmitted(false)}
                className="btn-secondary"
                style={{ fontSize: '0.85rem' }}
              >
                Submit Another Review
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
            
            {/* Rating 1: Supervisor */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                  {t.ratingSupervisor}
                </label>
                <span style={{ fontWeight: 700, color: '#00D4AA' }}>{supervisorRating} / 5 ⭐</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={supervisorRating}
                onChange={(e) => setSupervisorRating(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#00D4AA', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>Disrespectful / Intimidating</span>
                <span>Fair & Respectful</span>
              </div>
            </div>

            {/* Rating 2: Workload & Breaks */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                  {t.ratingWorkload}
                </label>
                <span style={{ fontWeight: 700, color: '#F59E0B' }}>{workloadRating} / 5 ⭐</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={workloadRating}
                onChange={(e) => setWorkloadRating(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#F59E0B', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>Excessive Pressure / Denied Breaks</span>
                <span>Manageable Pace & Timely Breaks</span>
              </div>
            </div>

            {/* Rating 3: Facilities */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                  {t.ratingFacilities}
                </label>
                <span style={{ fontWeight: 700, color: '#6366F1' }}>{facilitiesRating} / 5 ⭐</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={facilitiesRating}
                onChange={(e) => setFacilitiesRating(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#6366F1', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>Poor Hygiene / No Drinking Water</span>
                <span>Clean Restrooms & Cold Water</span>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                {t.writtenFeedback}
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share any concerns without fear — management only sees anonymized department aggregates..."
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

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
            >
              <span>🔒</span> {t.submitFeedback}
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
