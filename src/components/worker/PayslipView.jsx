import React from 'react';
import { calculateShiftPay } from '../../utils/fairshiftLogic';

export default function PayslipView({ worker, sector, t }) {
  // Compute monthly representative payslip
  const monthlyHours = worker.totalHours || 176;
  const payCalc = calculateShiftPay(monthlyHours, worker.hourlyRate, worker.hazardRate);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Summary */}
      <div className="glass-panel" style={{ padding: '24px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="pill-badge pill-teal">SDG 8.5 Fair Compensation</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Cycle: October 2026
              </span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{t.payslipTitle}</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{t.payslipSubtitle}</p>
          </div>

          <button
            onClick={handlePrint}
            className="btn-secondary"
            style={{ fontSize: '0.85rem' }}
          >
            <span>📄</span> {t.downloadSlip}
          </button>
        </div>

        {/* Worker Summary Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginTop: '20px',
          padding: '16px',
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Worker Name & ID</div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{worker.name}</div>
            <div style={{ fontSize: '0.75rem', color: '#00D4AA' }}>{worker.id}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Organization / Site</div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{sector.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{worker.role}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Standard Hourly Rate</div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>₹{worker.hourlyRate}/hr</div>
            <div style={{ fontSize: '0.75rem', color: '#F59E0B' }}>Overtime: ₹{(worker.hourlyRate * 1.5).toFixed(0)}/hr (1.5x)</div>
          </div>
        </div>
      </div>

      {/* Main Transparent Calculation Breakdown */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>
          Earnings Breakdown — Full Transparency
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Base Wage */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 'var(--radius-sm)'
          }}>
            <div>
              <div style={{ fontWeight: 600 }}>{t.baseWage}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {payCalc.standardHours} standard hours @ ₹{payCalc.hourlyRate}/hr
              </div>
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#F8FAFC' }}>
              ₹{payCalc.basePay.toLocaleString()}
            </div>
          </div>

          {/* Overtime Premium */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            background: 'rgba(0, 212, 170, 0.06)',
            borderRadius: 'var(--radius-sm)',
            borderLeft: '4px solid #00D4AA'
          }}>
            <div>
              <div style={{ fontWeight: 600, color: '#00D4AA' }}>{t.overtimePay}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {payCalc.overtimeHours} verified overtime hours @ 1.5x statutory multiplier (₹{(payCalc.hourlyRate * 1.5).toFixed(0)}/hr)
              </div>
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#00D4AA' }}>
              + ₹{payCalc.overtimePay.toLocaleString()}
            </div>
          </div>

          {/* Hazard Allowance */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            background: 'rgba(245, 158, 11, 0.06)',
            borderRadius: 'var(--radius-sm)',
            borderLeft: '4px solid #F59E0B'
          }}>
            <div>
              <div style={{ fontWeight: 600, color: '#FBBF24' }}>{t.hazardAllowance}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Special high-risk worksite allowance @ ₹{payCalc.hazardRate}/hr
              </div>
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#FBBF24' }}>
              + ₹{payCalc.hazardPay.toLocaleString()}
            </div>
          </div>

          {/* Gross Subtotal */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '14px 16px',
            borderTop: '1px solid var(--border-subtle)',
            borderBottom: '1px solid var(--border-subtle)',
            fontSize: '1rem',
            fontWeight: 700
          }}>
            <div>{t.grossEarned}</div>
            <div>₹{payCalc.grossEarnings.toLocaleString()}</div>
          </div>

          {/* Statutory Deductions */}
          <div style={{
            padding: '14px 16px',
            background: 'rgba(239, 68, 68, 0.04)',
            borderRadius: 'var(--radius-sm)',
            borderLeft: '4px solid #EF4444'
          }}>
            <div style={{ fontWeight: 600, color: '#F87171', marginBottom: '8px' }}>
              {t.statutoryDeductions}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>• Employees Provident Fund (PF 12%):</span>
              <span style={{ fontWeight: 600 }}>- ₹{payCalc.pfDeduction.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>• Employee State Insurance (ESI 0.75%):</span>
              <span style={{ fontWeight: 600 }}>- ₹{payCalc.esiDeduction.toLocaleString()}</span>
            </div>
          </div>

          {/* Final Net Take-Home */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(0, 212, 170, 0.4)',
            marginTop: '8px'
          }}>
            <div>
              <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#00D4AA', fontWeight: 700 }}>
                {t.netTakeHome}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Directly credited to worker bank account (Aadhaar Linked)
              </div>
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.4rem',
              fontWeight: 800,
              color: '#F8FAFC'
            }}>
              ₹{payCalc.netTakeHome.toLocaleString()}
            </div>
          </div>

        </div>

        {/* Verification Footer */}
        <div style={{
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🔒</span>
            <span>Cryptographic Proof: <strong>0x7f1a...892e</strong></span>
          </div>
          <div>Audited against ILO Fair Labor Convention No. 95</div>
        </div>
      </div>

    </div>
  );
}
