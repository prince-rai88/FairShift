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
      background: 'rgba(255, 255, 255, 0.88)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0 28px',
      boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.03)'
    }}>
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        gap: '16px',
      }}>

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px',
            borderRadius: '11px',
            background: 'var(--accent-black)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px',
            boxShadow: '0 2px 8px -1px rgba(15, 23, 42, 0.3)',
          }}>⚖️</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.03em' }}>
              Fair<span style={{ color: 'var(--accent-green)' }}>Shift</span>
            </span>
            <span className="badge badge-black" style={{ fontSize: '0.62rem', letterSpacing: '0.04em' }}>
              UN SDG 8.5 & 8.8
            </span>
          </div>
        </div>

        {/* Center controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Sector toggle */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '2px',
            background: 'var(--bg-input)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-full)',
            padding: '3px',
          }}>
            <button
              onClick={() => setActiveSector('construction')}
              className={`pill-toggle${activeSector === 'construction' ? ' active' : ''}`}
              style={{ padding: '6px 14px', fontSize: '0.8rem', border: 'none', background: activeSector === 'construction' ? 'var(--accent-black)' : 'transparent', boxShadow: activeSector === 'construction' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none' }}
            >
              🏗️ Construction
            </button>
            <button
              onClick={() => setActiveSector('hospital')}
              className={`pill-toggle${activeSector === 'hospital' ? ' active' : ''}`}
              style={{ padding: '6px 14px', fontSize: '0.8rem', border: 'none', background: activeSector === 'hospital' ? 'var(--accent-black)' : 'transparent', boxShadow: activeSector === 'hospital' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none' }}
            >
              🏥 Hospital
            </button>
          </div>

          {/* Language selector */}
          <select
            value={currentLang}
            onChange={(e) => setLang(e.target.value)}
            className="fs-input"
            style={{ width: 'auto', padding: '6px 30px 6px 12px', fontSize: '0.82rem', borderRadius: 'var(--radius-full)', height: '36px' }}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="ta">தமிழ்</option>
          </select>
        </div>

        {/* Role switcher */}
        <div style={{
          display: 'flex', gap: '2px',
          background: 'var(--bg-input)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-full)',
          padding: '3px',
        }}>
          <button
            onClick={() => setActiveRole('worker')}
            className={`pill-toggle${activeRole === 'worker' ? ' active' : ''}`}
            style={{ padding: '6px 16px', fontSize: '0.82rem', border: 'none', background: activeRole === 'worker' ? 'var(--accent-black)' : 'transparent', boxShadow: activeRole === 'worker' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none' }}
          >
            👷 {t.roleWorker || 'Worker'}
          </button>
          <button
            onClick={() => setActiveRole('admin')}
            className={`pill-toggle${activeRole === 'admin' ? ' active' : ''}`}
            style={{ padding: '6px 16px', fontSize: '0.82rem', border: 'none', background: activeRole === 'admin' ? 'var(--accent-black)' : 'transparent', boxShadow: activeRole === 'admin' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none' }}
          >
            📊 {t.roleAdmin || 'Employer'}
          </button>
        </div>

      </div>
    </header>
  );
}
