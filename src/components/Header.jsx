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
      background: '#FFFFFF',
      borderBottom: '1.5px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0 28px',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '60px',
        gap: '16px',
      }}>

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px', height: '34px',
            borderRadius: '10px',
            background: 'var(--accent-black)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px',
          }}>⚖️</div>
          <span style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.03em' }}>
            Fair<span style={{ color: '#16A34A' }}>Shift</span>
          </span>
          <span className="badge badge-black" style={{ fontSize: '0.62rem' }}>SDG 8</span>
        </div>

        {/* Center controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Sector toggle */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            background: 'var(--bg-page)',
            border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius-full)',
            padding: '4px',
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
            style={{ width: 'auto', padding: '7px 32px 7px 12px', fontSize: '0.82rem', borderRadius: 'var(--radius-full)' }}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="ta">தமிழ்</option>
          </select>
        </div>

        {/* Role switcher */}
        <div style={{
          display: 'flex', gap: '4px',
          background: 'var(--bg-page)',
          border: '1.5px solid var(--border)',
          borderRadius: 'var(--radius-full)',
          padding: '4px',
        }}>
          <button
            onClick={() => setActiveRole('worker')}
            className={`pill-toggle${activeRole === 'worker' ? ' active' : ''}`}
            style={{ padding: '6px 16px', fontSize: '0.82rem' }}
          >
            👷 {t.roleWorker || 'Worker'}
          </button>
          <button
            onClick={() => setActiveRole('admin')}
            className={`pill-toggle${activeRole === 'admin' ? ' active' : ''}`}
            style={{ padding: '6px 16px', fontSize: '0.82rem' }}
          >
            📊 {t.roleAdmin || 'Employer'}
          </button>
        </div>

      </div>
    </header>
  );
}
