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
      <div className="card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="section-num">1</span>
          <span className="section-label">Earnings Breakdown</span>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          October 2026 · {t.payslipSubtitle}
        </div>

        {/* Worker info row */}
        <div style={{
          background: 'var(--bg-page)', borderRadius: 'var(--radius-md)',
          padding: '14px 16px', marginBottom: '20px',
          border: '1.5px solid var(--border)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Worker</span>
            <span style={{ fontWeight: 700 }}>{worker.name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
            <span style={{ color: 'var(--text-muted)' }}>ID</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{worker.id}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Site</span>
            <span style={{ fontWeight: 600 }}>{sector.name}</span>
          </div>
        </div>

        {/* Line items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          {rows.map((row, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 14px',
              background: 'var(--bg-page)', borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--border)',
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{row.label}</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>{row.sub}</div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: row.color }}>
                {row.sign}{row.value}
              </div>
            </div>
          ))}
        </div>

        {/* Gross */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          padding: '12px 14px',
          borderTop: '1.5px solid var(--border)', borderBottom: '1.5px solid var(--border)',
          marginBottom: '10px', fontWeight: 700,
        }}>
          <span>{t.grossEarned}</span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>₹{payCalc.grossEarnings.toLocaleString()}</span>
        </div>

        {/* Deductions */}
        <div style={{
          padding: '12px 14px',
          background: '#FEF2F2', borderRadius: 'var(--radius-md)',
          border: '1.5px solid #FECACA', marginBottom: '16px',
        }}>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--accent-red)', marginBottom: '8px' }}>
            {t.statutoryDeductions}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.83rem', marginBottom: '5px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>PF (Provident Fund 12%)</span>
            <span style={{ fontWeight: 700 }}>- ₹{payCalc.pfDeduction.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.83rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>ESI (Employee State Insurance 0.75%)</span>
            <span style={{ fontWeight: 700 }}>- ₹{payCalc.esiDeduction.toLocaleString()}</span>
          </div>
        </div>

        {/* Net take-home — hero */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px',
          background: 'var(--accent-black)', borderRadius: 'var(--radius-lg)',
          color: '#fff',
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.7, marginBottom: '4px' }}>
              {t.netTakeHome}
            </div>
            <div style={{ fontSize: '0.78rem', opacity: 0.6 }}>Direct to bank · Aadhaar linked</div>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2.5rem', fontWeight: 700 }}>
            ₹{payCalc.netTakeHome.toLocaleString()}
          </div>
        </div>
      </div>

      {/* RIGHT — Transparency & Print */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        <div className="card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
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
                display: 'flex', gap: '12px', alignItems: 'flex-start',
                padding: '12px', background: 'var(--bg-page)',
                borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border)',
              }}>
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', fontFamily: item.mono ? 'var(--font-mono)' : 'inherit', marginTop: '2px' }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <span className="section-num">3</span>
            <span className="section-label">Download</span>
          </div>
          <button onClick={() => window.print()} className="btn-black" style={{ width: '100%', padding: '14px' }}>
            📄 {t.downloadSlip}
          </button>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '10px', textAlign: 'center' }}>
            PDF includes QR code for instant verification
          </p>
        </div>

      </div>
    </div>
  );
}
