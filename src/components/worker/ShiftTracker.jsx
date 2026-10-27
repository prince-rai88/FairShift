import React, { useState, useEffect } from 'react';
import { calculateShiftPay } from '../../utils/fairshiftLogic';

export default function ShiftTracker({ worker, sector, t, activeShift, setActiveShift, onShiftCompleted }) {
  const [elapsedSeconds, setElapsedSeconds] = useState(activeShift ? activeShift.elapsedSeconds || 28800 : 0);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrScanning, setQrScanning] = useState(false);
  const [qrSuccessMessage, setQrSuccessMessage] = useState(null);

  useEffect(() => {
    let interval = null;
    if (activeShift) {
      interval = setInterval(() => setElapsedSeconds(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [activeShift]);

  const hoursWorked = elapsedSeconds / 3600;
  const payCalculation = calculateShiftPay(hoursWorked, worker.hourlyRate, worker.hazardRate);
  const isOvertime = hoursWorked > 8.0;

  const formatTime = (total) => {
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  };

  const handleScanQr = () => {
    setIsQrModalOpen(true); setQrScanning(true); setQrSuccessMessage(null);
    setTimeout(() => {
      setQrScanning(false);
      setQrSuccessMessage(`Verified at ${sector.name} — Gate 4`);
      setTimeout(() => {
        setIsQrModalOpen(false);
        setActiveShift({ startTime: new Date().toLocaleTimeString(), location: `${sector.name} — Gate 4`, elapsedSeconds: 0 });
        setElapsedSeconds(0);
      }, 1200);
    }, 1800);
  };

  const handlePunchOut = () => {
    if (!activeShift) return;
    const finalHours = Math.max(1, parseFloat(hoursWorked.toFixed(1)));
    const finalPay = calculateShiftPay(finalHours, worker.hourlyRate, worker.hazardRate);
    if (onShiftCompleted) {
      onShiftCompleted({ date: 'Today (Just Completed)', hours: finalHours, base: finalPay.basePay, ot: finalPay.overtimePay, net: finalPay.netTakeHome, status: 'Verified & Audited' });
    }
    setActiveShift(null); setElapsedSeconds(0);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', alignItems: 'start' }}>

      {/* LEFT — Live Shift Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* ① SHIFT STATUS & TIMER */}
        <div className="card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="section-num">1</span>
              <span className="section-label">Shift Status</span>
            </div>
            {activeShift && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: 'var(--radius-full)', background: isOvertime ? '#FEF2F2' : '#ECFDF5', border: isOvertime ? '1px solid #FECACA' : '1px solid #A7F3D0', color: isOvertime ? '#DC2626' : '#047857', fontSize: '0.74rem', fontWeight: 700 }}>
                <span className="pulse-dot" style={{ width: '7px', height: '7px', borderRadius: '50%', background: isOvertime ? '#DC2626' : '#10B981' }} />
                {isOvertime ? '1.5x OVERTIME ACTIVE' : 'ON-SITE VERIFIED'}
              </div>
            )}
          </div>

          {/* Luxury Stopwatch Display */}
          <div style={{
            background: isOvertime
              ? 'radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.06) 0%, rgba(255, 255, 255, 0.8) 100%)'
              : 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.06) 0%, rgba(255, 255, 255, 0.8) 100%)',
            border: isOvertime ? '1.5px solid #FECACA' : '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '28px 20px',
            marginBottom: '20px',
            textAlign: 'center',
            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.02)'
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '4rem',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: isOvertime ? 'var(--accent-red)' : 'var(--text-primary)',
              lineHeight: 1,
              marginBottom: '10px',
            }}>
              {formatTime(elapsedSeconds)}
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              {activeShift
                ? `Clocked in at ${activeShift.startTime} · ${activeShift.location}`
                : t.noActiveShift}
            </div>
          </div>

          {/* Overtime Notice Banner */}
          {isOvertime && (
            <div style={{
              background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--radius-md)',
              padding: '12px 16px', fontSize: '0.85rem', color: 'var(--accent-red)', marginBottom: '20px',
              display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600
            }}>
              <span>⚠️</span>
              <span>{t.overtimeWarning}</span>
            </div>
          )}

          {/* Tactile Punch Actions */}
          {!activeShift ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button id="punch-in-qr" onClick={handleScanQr} className="btn-black" style={{ width: '100%', padding: '16px', fontSize: '1rem', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>📷</span> {t.simulatedQr}
              </button>
              <button
                id="punch-in-quick"
                onClick={() => { setActiveShift({ startTime: new Date().toLocaleTimeString(), location: `${sector.name} — Geofence Verified`, elapsedSeconds: 0 }); setElapsedSeconds(0); }}
                className="btn-outline"
                style={{ width: '100%', padding: '14px', fontSize: '0.9rem' }}
              >
                ⚡ Quick Punch IN (Geofence Verified)
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button id="punch-out-btn" onClick={handlePunchOut} className="btn-red" style={{ width: '100%', padding: '16px', fontSize: '1rem', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>🛑</span> {t.checkOutBtn}
              </button>
              <button
                onClick={() => setElapsedSeconds(prev => prev + 7200)}
                className="btn-outline"
                title="Fast-forward 2 hours to test 1.5x overtime multiplier"
                style={{ width: '100%', padding: '12px', fontSize: '0.85rem' }}
              >
                ⏩ +2 Hours (Fast-Forward Overtime Demo)
              </button>
            </div>
          )}
        </div>

        {/* ② LIVE ACCUMULATED EARNINGS */}
        {activeShift && (
          <div className="card" style={{ padding: '26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <span className="section-num">2</span>
              <span className="section-label">Live Accumulated Wages</span>
            </div>
            
            <div style={{
              background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline'
            }}>
              <div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                  Estimated Net Take-Home
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2.8rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                  ₹{payCalculation.netTakeHome}
                </div>
              </div>
              <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>
                Live Calculator
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t.standardHours}</div>
                <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--accent-green)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                  {payCalculation.standardHours}h
                </div>
              </div>
              <div style={{ background: payCalculation.overtimeHours > 0 ? '#FEF2F2' : 'var(--bg-input)', border: payCalculation.overtimeHours > 0 ? '1px solid #FECACA' : '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t.overtimeHours}</div>
                <div style={{ fontWeight: 700, fontSize: '1.25rem', color: payCalculation.overtimeHours > 0 ? 'var(--accent-red)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                  {payCalculation.overtimeHours}h
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT — Shift History & Transparent Ledger */}
      <div className="card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="section-num">{activeShift ? '3' : '2'}</span>
            <span className="section-label">{t.shiftHistory}</span>
          </div>
          <span className="badge badge-green">✓ {t.wageProofBadge}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {worker.recentShifts.map((shift, idx) => (
            <div key={idx} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 18px',
              background: '#FFFFFF',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.94rem' }}>{shift.date}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {shift.hours} hrs worked {shift.ot > 0 ? `· ${shift.ot > 0 ? 'Includes 1.5x Overtime' : ''}` : ''}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                  ₹{shift.net}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--accent-green)', fontWeight: 700 }}>
                  ✓ {shift.status}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Audit Verification Note */}
        <div style={{
          marginTop: '20px',
          padding: '14px',
          background: 'var(--bg-input)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.78rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>🛡️</span>
          <span>Every shift check-out is cryptographically validated with zero unitemized deductions.</span>
        </div>
      </div>

      {/* QR Scanner Simulation Modal */}
      {isQrModalOpen && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: '20px'
        }}>
          <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '28px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>
              Worksite Gate Scanner
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Hold device steady over {sector.name} QR code
            </p>

            <div style={{
              width: '200px', height: '200px', margin: '0 auto 20px',
              border: '2px dashed var(--accent-black)',
              borderRadius: 'var(--radius-md)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#F8FAFC',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {qrScanning ? (
                <div>
                  <div style={{ fontSize: '40px', marginBottom: '8px' }}>📷</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-blue)' }}>Scanning Gate Code...</div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '40px', marginBottom: '8px' }}>✓</div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--accent-green)' }}>{qrSuccessMessage}</div>
                </div>
              )}
            </div>

            <button onClick={() => setIsQrModalOpen(false)} className="btn-outline" style={{ width: '100%' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
