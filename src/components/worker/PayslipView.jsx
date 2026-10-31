import React from 'react';
import { calculateShiftPay } from '../../utils/fairshiftLogic';

export default function PayslipView({ worker, sector, t }) {
  const monthlyHours = worker.totalHours || 176;
  const payCalc = calculateShiftPay(monthlyHours, worker.hourlyRate, worker.hazardRate);

  const rows = [
    { label: t.baseWage, sub: `${payCalc.standardHours}h @ ₹${payCalc.hourlyRate}/hr`, value: `₹${payCalc.basePay.toLocaleString()}`, color: 'var(--text-primary)', sign: '' },
    { label: t.overtimePay, sub: `${payCalc.overtimeHours}h @ ₹${(payCalc.hourlyRate * 1.5).toFixed(0)}/hr (1.5×)`, value: `₹${payCalc.overtimePay.toLocaleString()}`, color: 'var(--accent-green)', sign: '+' },
    { label: t.hazardAllowance, sub: `High-risk site allowance @ ₹${payCalc.hazardRate}/hr`, value: `₹${payCalc.hazardPay.toLocaleString()}`, color: 'var(--accent-amber)', sign: '+' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>

      {/* LEFT — Earnings Breakdown */}
      <div className="card" style={{ padding: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <span className="section-num">1</span>
          <span className="section-label">Earnings Breakdown</span>
        </div>
        <div style={{ fontSize: '0.82rem', color: '#94A3B8', marginBottom: '24px' }}>
          October 2026 · {t.payslipSubtitle}
        </div>

        {/* Worker info row */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 18px',
          marginBottom: '20px',
          border: '1px solid var(--border-glass)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '6px' }}>
            <span style={{ color: '#94A3B8' }}>Worker</span>
            <span style={{ fontWeight: 700, color: '#FFFFFF' }}>{worker.name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '6px' }}>
            <span style={{ color: '#94A3B8' }}>ID</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#38BDF8' }}>{worker.id}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem' }}>
            <span style={{ color: '#94A3B8' }}>Site</span>
            <span style={{ fontWeight: 600, color: '#F1F5F9' }}>{sector.name}</span>
          </div>
        </div>

        {/* Line items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
          {rows.map((row, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 16px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-glass)',
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#FFFFFF' }}>{row.label}</div>
                <div style={{ fontSize: '0.76rem', color: '#94A3B8', marginTop: '2px' }}>{row.sub}</div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1rem', color: row.color }}>
                {row.sign}{row.value}
              </div>
            </div>
          ))}
        </div>

        {/* Gross */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          padding: '14px 16px',
          borderTop: '1px solid var(--border-glass)',
          borderBottom: '1px solid var(--border-glass)',
          marginBottom: '14px',
          fontWeight: 700,
          color: '#FFFFFF',
        }}>
          <span>{t.grossEarned}</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: '#38BDF8' }}>₹{payCalc.grossEarnings.toLocaleString()}</span>
        </div>

        {/* Deductions */}
        <div style={{
          padding: '14px 16px',
          background: 'rgba(239, 68, 68, 0.1)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          marginBottom: '18px',
        }}>
          <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#F87171', marginBottom: '8px' }}>
            {t.statutoryDeductions}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '6px' }}>
            <span style={{ color: '#FCA5A5' }}>PF (Provident Fund 12%)</span>
            <span style={{ fontWeight: 700, color: '#F87171' }}>- ₹{payCalc.pfDeduction.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
            <span style={{ color: '#FCA5A5' }}>ESI (Employee State Insurance 0.75%)</span>
            <span style={{ fontWeight: 700, color: '#F87171' }}>- ₹{payCalc.esiDeduction.toLocaleString()}</span>
          </div>
        </div>

        {/* Net take-home — hero liquid card */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '22px 24px',
          background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.7), rgba(6, 182, 212, 0.3))',
          borderRadius: 'var(--radius-lg)',
          border: '1.5px solid rgba(56, 189, 248, 0.5)',
          boxShadow: '0 12px 35px rgba(6, 182, 212, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
          color: '#fff',
        }}>
          <div>
            <div style={{ fontSize: '0.74rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#BAE6FD', fontWeight: 600, marginBottom: '4px' }}>
              {t.netTakeHome}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#E0F2FE' }}>Direct to bank · Aadhaar linked</div>
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '2.6rem',
            fontWeight: 800,
            color: '#FFFFFF',
            textShadow: '0 0 25px rgba(255, 255, 255, 0.4)',
          }}>
            ₹{payCalc.netTakeHome.toLocaleString()}
          </div>
        </div>
      </div>

      {/* RIGHT — Transparency & Print */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        <div className="card" style={{ padding: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
            <span className="section-num">2</span>
            <span className="section-label">Transparency Proof</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { icon: '🔒', label: 'Cryptographic Proof', value: '0x7f1a...892e', mono: true },
              { icon: '📜', label: 'Audited Against', value: 'ILO Fair Labor Convention No. 95', mono: false },
              { icon: '🏦', label: 'Disbursement', value: 'Direct Bank Transfer (Aadhaar DBT)', mono: false },
              { icon: '⚖️', label: 'Compliance', value: 'Min. Wages Act · Factories Act', mono: false },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', gap: '14px', alignItems: 'flex-start',
                padding: '14px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-glass)',
              }}>
                <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#FFFFFF', fontFamily: item.mono ? 'var(--font-mono)' : 'inherit', marginTop: '2px' }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <span className="section-num">3</span>
            <span className="section-label">Download</span>
          </div>
          <button onClick={() => window.print()} className="btn-black" style={{ width: '100%', padding: '16px', fontSize: '0.95rem' }}>
            📄 {t.downloadSlip}
          </button>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '12px', textAlign: 'center' }}>
            PDF includes QR code for instant verification
          </p>
        </div>

      </div>
    </div>
  );
}
