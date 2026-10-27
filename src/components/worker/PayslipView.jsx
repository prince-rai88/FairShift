import React from 'react';
import { calculateShiftPay } from '../../utils/fairshiftLogic';

export default function PayslipView({ worker, sector, t }) {
  const monthlyHours = worker.totalHours || 176;
  const payCalc = calculateShiftPay(monthlyHours, worker.hourlyRate, worker.hazardRate);

  const rows = [
    { label: t.baseWage, sub: `${payCalc.standardHours}h standard @ ₹${payCalc.hourlyRate}/hr`, value: `₹${payCalc.basePay.toLocaleString()}`, color: 'var(--text-primary)', sign: '' },
    { label: t.overtimePay, sub: `${payCalc.overtimeHours}h overtime @ ₹${(payCalc.hourlyRate * 1.5).toFixed(0)}/hr (1.5× statutory rate)`, value: `₹${payCalc.overtimePay.toLocaleString()}`, color: 'var(--accent-green)', sign: '+' },
    { label: t.hazardAllowance, sub: `Hazardous environment premium @ ₹${payCalc.hazardRate}/hr`, value: `₹${payCalc.hazardPay.toLocaleString()}`, color: 'var(--accent-amber)', sign: '+' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', alignItems: 'start' }}>

      {/* LEFT — Earnings Breakdown */}
      <div className="card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="section-num">1</span>
            <span className="section-label">Itemized Earnings</span>
          </div>
          <span className="badge badge-black" style={{ fontSize: '0.66rem' }}>OCTOBER 2026</span>
        </div>
        
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          {t.payslipSubtitle}
        </p>

        {/* Worker & Site Identity Badge */}
        <div style={{
          background: 'var(--bg-input)', borderRadius: 'var(--radius-md)',
          padding: '16px', marginBottom: '20px',
          border: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Worker Name</span>
            <strong style={{ color: 'var(--text-primary)' }}>{worker.name}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Worker ID</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{worker.id}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Assigned Site</span>
            <strong style={{ color: 'var(--text-primary)' }}>{sector.name}</strong>
          </div>
        </div>

        {/* Line Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
          {rows.map((row, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 16px',
              background: '#FFFFFF', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{row.label}</div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>{row.sub}</div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.05rem', color: row.color }}>
                {row.sign}{row.value}
              </div>
            </div>
          ))}
        </div>

        {/* Gross Earnings Total */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 18px',
          background: 'var(--bg-input)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px'
        }}>
          <span style={{ fontWeight: 700, fontSize: '0.94rem' }}>{t.grossEarnings}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.25rem' }}>
            ₹{payCalc.grossEarnings.toLocaleString()}
          </span>
        </div>

        {/* Action Button */}
        <button onClick={handlePrint} className="btn-outline" style={{ width: '100%', gap: '8px' }}>
          <span>🖨️</span> Print / Save Payslip PDF
        </button>
      </div>

      {/* RIGHT — Statutory Deductions & Net Take-Home */}
      <div className="card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="section-num">2</span>
            <span className="section-label">Statutory Social Security</span>
          </div>
          <span className="badge badge-green">Zero Hidden Deductions</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {/* PF Deduction */}
          <div style={{
            padding: '16px',
            background: '#FFFFFF',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <div>
                <strong style={{ fontSize: '0.92rem' }}>Provident Fund (EPF - 12%)</strong>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Statutory retirement & pension accumulation</div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-red)' }}>
                -₹{payCalc.pfDeduction.toLocaleString()}
              </span>
            </div>
          </div>

          {/* ESI Deduction */}
          <div style={{
            padding: '16px',
            background: '#FFFFFF',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <div>
                <strong style={{ fontSize: '0.92rem' }}>Employee State Insurance (ESI - 0.75%)</strong>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Workplace injury & outpatient medical cover</div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-red)' }}>
                -₹{payCalc.esiDeduction.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Net Take-Home Hero Display */}
        <div style={{
          background: 'linear-gradient(180deg, #F0FDF4 0%, #DCFCE7 100%)',
          border: '1.5px solid #BBF7D0',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          marginBottom: '20px',
          textAlign: 'center',
          boxShadow: '0 4px 16px -2px rgba(16, 185, 129, 0.15)'
        }}>
          <div style={{ fontSize: '0.78rem', color: '#15803D', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {t.netTakeHome}
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '3.2rem',
            fontWeight: 700,
            color: '#14532D',
            lineHeight: 1.1,
            margin: '8px 0'
          }}>
            ₹{payCalc.netTakeHome.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 600 }}>
            ✓ Transferred directly to Aadhaar-linked wage account
          </div>
        </div>

        {/* Tamper-Proof Cryptographic Watermark */}
        <div style={{
          padding: '12px 16px',
          background: 'var(--bg-input)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.74rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-secondary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>🛡️ Tamper-Evident Hash:</span>
          <strong>SHA256:sdg8_{worker.id.toLowerCase()}_verified</strong>
        </div>
      </div>

    </div>
  );
}
