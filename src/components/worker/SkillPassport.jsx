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

      {/* LEFT — Credential Card + Skills */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Identity Card */}
        <div style={{
          background: '#0A0A0A', borderRadius: 'var(--radius-xl)',
          padding: '28px', position: 'relative', overflow: 'hidden',
          border: '1.5px solid #1a1a1a',
        }}>
          {/* Subtle texture */}
          <div style={{
            position: 'absolute', top: '-80px', right: '-80px', width: '200px', height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(22,163,74,0.25) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <span className="badge" style={{ background: '#1a1a1a', color: '#9ca3af', border: '1px solid #333', fontSize: '0.62rem', marginBottom: '10px', display: 'inline-flex' }}>
                PORTABLE SKILL PASSPORT
              </span>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', marginTop: '6px' }}>
                {worker.name}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '4px' }}>
                {worker.role} · {sector.name}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.68rem', color: '#4b5563', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.workerId}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 700, color: '#16a34a' }}>
                {worker.id}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
            {[
              { label: 'Verified Hours', value: worker.totalHours },
              { label: 'Skill Badges', value: worker.skills.length },
              { label: 'Safety Level', value: 'Level A' },
            ].map((stat, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px' }}>
                <div style={{ fontSize: '0.68rem', color: '#6b7280', marginBottom: '4px' }}>{stat.label}</div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>{stat.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setIsShareModalOpen(true)} className="btn-green" style={{ flex: 1, fontSize: '0.88rem' }}>
              📲 {t.exportPassport}
            </button>
            <button onClick={() => setIsAddSkillOpen(true)} style={{
              flex: 1, padding: '12px', borderRadius: 'var(--radius-md)', fontWeight: 700,
              fontSize: '0.88rem', background: 'rgba(255,255,255,0.08)',
              border: '1.5px solid rgba(255,255,255,0.15)', color: '#fff',
              fontFamily: 'var(--font-sans)', cursor: 'pointer',
            }}>
              ➕ {t.addSkill}
            </button>
          </div>
        </div>

      </div>

      {/* RIGHT — Verified Badges */}
      <div className="card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <span className="section-num">2</span>
          <span className="section-label">{t.verifiedBadges}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {worker.skills.map(skill => (
            <div key={skill.id} style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '14px 16px', background: 'var(--bg-page)',
              borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border)',
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                background: '#F0FDF4', border: '1.5px solid #BBF7D0',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
              }}>🏅</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '2px' }}>{skill.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
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
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div className="card" style={{ maxWidth: '360px', width: '100%', padding: '32px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>Digital Skill Verification QR</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Any employer can scan to instantly verify your certifications without re-training.
            </p>
            <div style={{
              width: '180px', height: '180px', margin: '0 auto 16px',
              background: '#fff', borderRadius: 'var(--radius-md)', padding: '12px',
              border: '1.5px solid var(--border)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ fontSize: '64px' }}>🔲</div>
              <div style={{ color: '#0A0A0A', fontSize: '0.65rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                FAIRSHIFT/{worker.id}
              </div>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '20px', fontFamily: 'var(--font-mono)' }}>
              Hash: #8a20e-passport
            </div>
            <button onClick={() => setIsShareModalOpen(false)} className="btn-outline" style={{ width: '100%' }}>Close</button>
          </div>
        </div>
      )}

      {/* Add Skill Modal */}
      {isAddSkillOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '32px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>Add Skill for Audit</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Submit your trade certification for official verification.
            </p>
            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Skill / Competency</label>
                <input type="text" required value={newTitle} onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. High-Voltage Cable Jointer" className="fs-input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Certifying Authority</label>
                <input type="text" value={newIssuer} onChange={e => setNewIssuer(e.target.value)}
                  placeholder="e.g. National Skill Council" className="fs-input" />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
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
