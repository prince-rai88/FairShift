import React from 'react';
import { translations } from '../i18n/translations';

export default function Header({ 
  currentLang, 
  setLang, 
  activeRole, 
  setActiveRole, 
  activeSector, 
  setActiveSector,
  isMobileFrame,
  setIsMobileFrame 
}) {
  const t = translations[currentLang] || translations.en;

  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(8, 12, 22, 0.9)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '12px 24px'
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand & SDG Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #00D4AA 0%, #6366F1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            boxShadow: '0 4px 15px rgba(0, 212, 170, 0.35)'
          }}>
            ⚖️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#F8FAFC' }}>
                Fair<span style={{ color: '#00D4AA' }}>Shift</span>
              </span>
              <span className="pill-badge pill-teal" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                UN SDG 8
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {t.tagline}
            </div>
          </div>
        </div>

        {/* Global Controls: Sector, Language, Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          
          {/* Sector Selector */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '4px'
          }}>
            <button
              onClick={() => setActiveSector('construction')}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.82rem',
                fontWeight: 600,
                background: activeSector === 'construction' ? 'rgba(0, 212, 170, 0.2)' : 'transparent',
                color: activeSector === 'construction' ? '#00D4AA' : 'var(--text-secondary)',
                border: activeSector === 'construction' ? '1px solid rgba(0, 212, 170, 0.3)' : '1px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              🏗️ Construction Site
            </button>
            <button
              onClick={() => setActiveSector('hospital')}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.82rem',
                fontWeight: 600,
                background: activeSector === 'hospital' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                color: activeSector === 'hospital' ? '#A5B4FC' : 'var(--text-secondary)',
                border: activeSector === 'hospital' ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              🏥 Metro Hospital
            </button>
          </div>

          {/* Language Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>🌐</span>
            <select
              value={currentLang}
              onChange={(e) => setLang(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '6px 10px',
                fontSize: '0.85rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="en" style={{ background: '#0E1526' }}>English</option>
              <option value="hi" style={{ background: '#0E1526' }}>हिन्दी (Hindi)</option>
              <option value="ta" style={{ background: '#0E1526' }}>தமிழ் (Tamil)</option>
            </select>
          </div>

          {/* Dual Interface Switcher: Worker vs Admin */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-card)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 'var(--radius-md)',
            padding: '3px'
          }}>
            <button
              onClick={() => setActiveRole('worker')}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: activeRole === 'worker' ? 'linear-gradient(135deg, #00D4AA 0%, #059669 100%)' : 'transparent',
                color: activeRole === 'worker' ? '#04241B' : 'var(--text-secondary)',
                boxShadow: activeRole === 'worker' ? '0 2px 10px rgba(0, 212, 170, 0.3)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <span>👷</span> {t.roleWorker}
            </button>
            <button
              onClick={() => setActiveRole('admin')}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: activeRole === 'admin' ? 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' : 'transparent',
                color: activeRole === 'admin' ? '#FFFFFF' : 'var(--text-secondary)',
                boxShadow: activeRole === 'admin' ? '0 2px 10px rgba(99, 102, 241, 0.3)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <span>🏢</span> {t.roleAdmin}
            </button>
          </div>

          {/* Worker Mobile Frame Toggle (Only active when in Worker mode) */}
          {activeRole === 'worker' && (
            <button
              onClick={() => setIsMobileFrame(!isMobileFrame)}
              title="Toggle Low-End Smartphone Simulation Frame"
              style={{
                background: isMobileFrame ? 'rgba(0, 212, 170, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                border: isMobileFrame ? '1px solid rgba(0, 212, 170, 0.4)' : '1px solid var(--border-subtle)',
                color: isMobileFrame ? '#00D4AA' : 'var(--text-secondary)',
                borderRadius: 'var(--radius-md)',
                padding: '7px 12px',
                fontSize: '0.82rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>📱</span> {isMobileFrame ? 'Mobile Frame: ON' : 'Mobile Frame: OFF'}
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
