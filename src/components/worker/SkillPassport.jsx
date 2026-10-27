import React, { useState } from 'react';

export default function SkillPassport({ worker, sector, t, onAddSkill }) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newIssuer, setNewIssuer] = useState('');

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newTitle) return;
    if (onAddSkill) {
      onAddSkill({
        title: newTitle,
        issuer: newIssuer || "National Skill Registry"
      });
    }
    setNewTitle('');
    setNewIssuer('');
    setIsAddSkillOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Universal DecentWork Credential Card */}
      <div style={{
        background: 'linear-gradient(135deg, #131C31 0%, #1E1B4B 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px',
        border: '1px solid rgba(99, 102, 241, 0.4)',
        boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.7)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Holographic accent glow */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 212, 170, 0.3) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="pill-badge pill-purple">PORTABLE SKILL PASSPORT</span>
              <span className="pill-badge pill-teal">SDG 8.6 Youth & Adult Skills</span>
            </div>
            <h2 style={{ fontSize: '1.7rem', fontWeight: 800, marginTop: '8px' }}>
              {worker.name}
            </h2>
            <div style={{ fontSize: '0.9rem', color: '#A5B4FC' }}>
              {worker.role} • {sector.name}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.workerId}</div>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '1.1rem',
              fontWeight: 700,
              color: '#00D4AA',
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '4px 10px',
              borderRadius: '6px'
            }}>
              {worker.id}
            </div>
          </div>
        </div>

        {/* Experience & Verified Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '12px',
          padding: '16px',
          background: 'rgba(0, 0, 0, 0.25)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Audited Experience</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F8FAFC' }}>
              {worker.totalHours} Verified Hours
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Accredited Skills</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#00D4AA' }}>
              {worker.skills.length} Badges
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Safety Standing</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#38BDF8' }}>
              Level A (Zero Violations)
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="btn-primary"
            style={{ fontSize: '0.88rem' }}
          >
            <span>📲</span> {t.exportPassport}
          </button>
          <button
            onClick={() => setIsAddSkillOpen(true)}
            className="btn-secondary"
            style={{ fontSize: '0.88rem' }}
          >
            <span>➕</span> {t.addSkill}
          </button>
        </div>
      </div>

      {/* Verified Badges List */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>
          {t.verifiedBadges}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {worker.skills.map((skill) => (
            <div key={skill.id} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(0, 212, 170, 0.15)',
                  color: '#00D4AA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  🏅
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#F8FAFC' }}>
                    {skill.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Accredited by: {skill.issuer} • Certified {skill.date}
                  </div>
                </div>
              </div>

              <span className="pill-badge pill-teal" style={{ fontSize: '0.75rem' }}>
                ✓ Immutable Verified
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Share Passport QR Modal */}
      {isShareModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '380px',
            width: '100%',
            padding: '28px',
            textAlign: 'center',
            border: '1px solid rgba(99, 102, 241, 0.4)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>
              Digital Skill Verification QR
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Any prospective employer or contractor can scan to verify your authentic certifications instantly without re-training from zero.
            </p>

            {/* Generated QR Placeholder */}
            <div style={{
              width: '200px',
              height: '200px',
              margin: '0 auto 16px',
              background: '#FFFFFF',
              borderRadius: '12px',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ fontSize: '72px' }}>🔲</div>
              <div style={{ color: '#0F172A', fontSize: '0.72rem', fontWeight: 800 }}>
                FAIRSHIFT://SKILLS/{worker.id}
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#A5B4FC', marginBottom: '20px' }}>
              DecentWork Cryptographic Hash: <strong>#8a20e-passport</strong>
            </div>

            <button
              onClick={() => setIsShareModalOpen(false)}
              className="btn-secondary"
              style={{ width: '100%' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add Skill Modal */}
      {isAddSkillOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '400px',
            width: '100%',
            padding: '28px',
            border: '1px solid rgba(0, 212, 170, 0.4)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>
              Add Skill for Employer Audit
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Submit your trade certification or practical test for official verification.
            </p>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Skill Name / Competency
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. High-Voltage Cable Jointer or Emergency Biohazard Drill"
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 14px',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Certifying Authority / Site
                </label>
                <input
                  type="text"
                  value={newIssuer}
                  onChange={(e) => setNewIssuer(e.target.value)}
                  placeholder="e.g. National Skill Council or Site Safety Directorate"
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 14px',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddSkillOpen(false)}
                  className="btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1 }}
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
