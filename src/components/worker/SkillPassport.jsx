import React, { useState } from 'react';

export default function SkillPassport({ worker, sector, t, onAddSkill }) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newIssuer, setNewIssuer] = useState('');

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newTitle) return;
    if (onAddSkill) onAddSkill({ title: newTitle, issuer: newIssuer || 'National Skill Registry' });
    setNewTitle(''); setNewIssuer(''); setIsAddSkillOpen(false);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>

      {/* LEFT — Holographic Liquid Credential Card */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Identity Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(8, 14, 33, 0.95) 0%, rgba(30, 58, 138, 0.4) 50%, rgba(6, 182, 212, 0.2) 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '30px',
          position: 'relative',
          overflow: 'hidden',
          border: '1.5px solid rgba(56, 189, 248, 0.4)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 35px rgba(6, 182, 212, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease',
        }}>
          {/* Subtle aurora liquid orb */}
          <div style={{
            position: 'absolute', top: '-70px', right: '-70px', width: '220px', height: '220px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '26px' }}>
            <div>
              <span className="badge badge-blue" style={{ fontSize: '0.62rem', marginBottom: '10px', display: 'inline-flex' }}>
                PORTABLE SKILL PASSPORT
              </span>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.03em', marginTop: '6px' }}>
                {worker.name}
              </div>
              <div style={{ fontSize: '0.86rem', color: '#94A3B8', marginTop: '4px' }}>
                {worker.role} · {sector.name}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.workerId}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem', fontWeight: 800, color: '#38BDF8' }}>
                {worker.id}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
            {[
              { label: 'Verified Hours', value: worker.totalHours },
              { label: 'Skill Badges', value: worker.skills.length },
              { label: 'Safety Level', value: 'Level A' },
            ].map((stat, i) => (
              <div key={i} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass)',
                borderRadius: '12px',
                padding: '14px',
              }}>
                <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginBottom: '4px' }}>{stat.label}</div>
                <div style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '1.15rem' }}>{stat.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setIsShareModalOpen(true)} className="btn-green" style={{ flex: 1, fontSize: '0.9rem' }}>
              📲 {t.exportPassport}
            </button>
            <button onClick={() => setIsAddSkillOpen(true)} className="btn-outline" style={{ flex: 1, fontSize: '0.9rem' }}>
              ➕ {t.addSkill}
            </button>
          </div>
        </div>

      </div>

      {/* RIGHT — Verified Badges */}
      <div className="card" style={{ padding: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
          <span className="section-num">2</span>
          <span className="section-label">{t.verifiedBadges}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {worker.skills.map(skill => (
            <div key={skill.id} style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '16px 18px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-glass)',
              transition: 'all 0.25s ease',
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
              }}>🏅</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.94rem', color: '#FFFFFF', marginBottom: '3px' }}>{skill.title}</div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                  {skill.issuer} · {skill.date}
                </div>
              </div>
              <span className="badge badge-green" style={{ flexShrink: 0, fontSize: '0.65rem' }}>✓ Verified</span>
            </div>
          ))}
        </div>
      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(3, 7, 18, 0.8)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px'
        }}>
          <div className="card" style={{ maxWidth: '380px', width: '100%', padding: '34px', textAlign: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.7), 0 0 40px rgba(6, 182, 212, 0.25)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px', color: '#FFFFFF' }}>Digital Skill Verification QR</h3>
            <p style={{ fontSize: '0.84rem', color: '#94A3B8', marginBottom: '22px' }}>
              Any employer can scan to instantly verify your certifications without re-training.
            </p>
            <div style={{
              width: '190px', height: '190px', margin: '0 auto 18px',
              background: '#FFFFFF', borderRadius: 'var(--radius-lg)', padding: '14px',
              border: '1.5px solid var(--border-glass)',
              boxShadow: '0 0 30px rgba(255, 255, 255, 0.2)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ fontSize: '68px' }}>🔲</div>
              <div style={{ color: '#0A0A0A', fontSize: '0.68rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                FAIRSHIFT/{worker.id}
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#38BDF8', marginBottom: '22px', fontFamily: 'var(--font-mono)' }}>
              Hash: #8a20e-passport
            </div>
            <button onClick={() => setIsShareModalOpen(false)} className="btn-outline" style={{ width: '100%' }}>Close</button>
          </div>
        </div>
      )}

      {/* Add Skill Modal */}
      {isAddSkillOpen && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(3, 7, 18, 0.8)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px'
        }}>
          <div className="card" style={{ maxWidth: '420px', width: '100%', padding: '34px', boxShadow: '0 25px 60px rgba(0,0,0,0.7), 0 0 40px rgba(6, 182, 212, 0.25)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px', color: '#FFFFFF' }}>Add Skill for Audit</h3>
            <p style={{ fontSize: '0.84rem', color: '#94A3B8', marginBottom: '22px' }}>
              Submit your trade certification for official verification.
            </p>
            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94A3B8' }}>Skill / Competency</label>
                <input type="text" required value={newTitle} onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. High-Voltage Cable Jointer" className="fs-input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94A3B8' }}>Certifying Authority</label>
                <input type="text" value={newIssuer} onChange={e => setNewIssuer(e.target.value)}
                  placeholder="e.g. National Skill Council" className="fs-input" />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                <button type="button" onClick={() => setIsAddSkillOpen(false)} className="btn-outline" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-black" style={{ flex: 1 }}>Save Skill</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
