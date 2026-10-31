import React from 'react';
import { translations } from '../i18n/translations';

export default function Header({ 
  currentLang, 
  setLang, 
  activeRole, 
  setActiveRole, 
  activeSector, 
  setActiveSector,
}) {
  const t = translations[currentLang] || translations.en;

  return (
    <header style={{
      background: 'rgba(8, 14, 33, 0.75)',
      backdropFilter: 'blur(24px) saturate(190%)',
      WebkitBackdropFilter: 'blur(24px) saturate(190%)',
      borderBottom: '1px solid var(--border-glass)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0 28px',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      transition: 'all 0.3s ease',
    }}>
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '66px',
        gap: '16px',
      }}>

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px', height: '38px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #1E40AF, #06B6D4)',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.4), inset 0 1px 1px rgba(255,255,255,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}>⚖️</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#FFFFFF' }}>
                Fair<span style={{ background: 'linear-gradient(135deg, #38BDF8, #34D399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Shift</span>
              </span>
              <span className="badge badge-blue" style={{ fontSize: '0.62rem', padding: '2px 8px' }}>UN SDG 8.5 & 8.8</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
              DECENT WORK & FAIR WAGES PLATFORM
            </div>
          </div>
        </div>

        {/* Center controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Sector toggle */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-full)',
            padding: '4px',
            backdropFilter: 'blur(16px)',
          }}>
            <button
              onClick={() => setActiveSector('construction')}
              className={`pill-toggle${activeSector === 'construction' ? ' active' : ''}`}
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
            >
              🏗️ Construction
            </button>
            <button
              onClick={() => setActiveSector('hospital')}
              className={`pill-toggle${activeSector === 'hospital' ? ' active' : ''}`}
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
            >
              🏥 Hospital
            </button>
          </div>

          {/* Language */}
          <select
            value={currentLang}
            onChange={(e) => setLang(e.target.value)}
            className="fs-input"
            style={{
              width: 'auto',
              padding: '7px 32px 7px 14px',
              fontSize: '0.82rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-glass)',
              color: '#F1F5F9',
              cursor: 'pointer',
            }}
          >
            <option value="en" style={{ background: '#0B132B', color: '#fff' }}>English</option>
            <option value="hi" style={{ background: '#0B132B', color: '#fff' }}>हिन्दी</option>
            <option value="ta" style={{ background: '#0B132B', color: '#fff' }}>தமிழ்</option>
          </select>
        </div>

        {/* Role switcher & System Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'flex', gap: '4px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-full)',
            padding: '4px',
            backdropFilter: 'blur(16px)',
          }}>
            <button
              id="role-worker-btn"
              onClick={() => setActiveRole('worker')}
              className={`pill-toggle${activeRole === 'worker' ? ' active' : ''}`}
              style={{ padding: '6px 16px', fontSize: '0.82rem' }}
            >
              👷 {t.roleWorker || 'Worker'}
            </button>
            <button
              id="role-admin-btn"
              onClick={() => setActiveRole('admin')}
              className={`pill-toggle${activeRole === 'admin' ? ' active' : ''}`}
              style={{ padding: '6px 16px', fontSize: '0.82rem' }}
            >
              📊 {t.roleAdmin || 'Employer'}
            </button>
          </div>

          {/* Django API status indicator */}
          <div
            title="Django REST Framework API Active"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              fontSize: '0.72rem',
              color: '#34D399',
              fontWeight: 600,
            }}
          >
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: '#34D399',
              boxShadow: '0 0 8px #34D399',
            }} />
            <span>API Online</span>
          </div>
        </div>

      </div>
    </header>
  );
}

