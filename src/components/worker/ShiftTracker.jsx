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
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>

      {/* LEFT — Live Shift Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* ① SHIFT STATUS */}
        <div className="card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <span className="section-num">1</span>
            <span className="section-label">Shift Status</span>
          </div>

          {/* Timer */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '3.8rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: isOvertime ? 'var(--accent-red)' : 'var(--text-primary)',
              lineHeight: 1,
              marginBottom: '8px',
            }}>
              {formatTime(elapsedSeconds)}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {activeShift
                ? `On-site since ${activeShift.startTime} · ${activeShift.location}`
                : t.noActiveShift}
            </div>
            {activeShift && (
              <div style={{ marginTop: '10px' }}>
                <span className={`badge ${isOvertime ? 'badge-red' : 'badge-green'}`}>
                  {isOvertime ? '● OVERTIME ACTIVE (1.5x)' : '● ON-SITE ACTIVE'}
                </span>
              </div>
            )}
          </div>

          {/* Overtime notice */}
          {isOvertime && (
            <div style={{
              background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--radius-md)',
              padding: '10px 14px', fontSize: '0.84rem', color: 'var(--accent-red)', marginBottom: '18px',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              ⚠️ {t.overtimeWarning}
            </div>
          )}

          {/* Punch buttons */}
          {!activeShift ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button id="punch-in-qr" onClick={handleScanQr} className="btn-black" style={{ width: '100%', padding: '16px', fontSize: '1rem' }}>
                📷 {t.simulatedQr}
              </button>
              <button
                id="punch-in-quick"
                onClick={() => { setActiveShift({ startTime: new Date().toLocaleTimeString(), location: `${sector.name} — Geofence Verified`, elapsedSeconds: 0 }); setElapsedSeconds(0); }}
                className="btn-outline"
                style={{ width: '100%', padding: '14px' }}
              >
                ⚡ Quick Punch IN (No QR)
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button id="punch-out-btn" onClick={handlePunchOut} className="btn-red" style={{ width: '100%', padding: '16px', fontSize: '1rem' }}>
                🛑 {t.checkOutBtn}
              </button>
              <button
                onClick={() => setElapsedSeconds(prev => prev + 7200)}
                className="btn-outline"
                title="Demo: fast-forward 2h to show overtime"
                style={{ width: '100%', padding: '12px', fontSize: '0.85rem' }}
              >
                ⏩ +2 Hours (Demo Overtime)
              </button>
            </div>
          )}
        </div>

        {/* ② LIVE EARNINGS */}
        {activeShift && (
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <span className="section-num">2</span>
              <span className="section-label">Live Earnings</span>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>
                Estimated Net This Shift
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2.8rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
                ₹{payCalculation.netTakeHome}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ background: 'var(--bg-page)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '3px' }}>{t.standardHours}</div>
                <div style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--accent-green)' }}>{payCalculation.standardHours}h</div>
              </div>
              <div style={{ background: payCalculation.overtimeHours > 0 ? '#FEF2F2' : 'var(--bg-page)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '3px' }}>{t.overtimeHours}</div>
                <div style={{ fontWeight: 700, fontSize: '1.15rem', color: payCalculation.overtimeHours > 0 ? 'var(--accent-red)' : 'var(--text-muted)' }}>{payCalculation.overtimeHours}h</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT — Shift History */}
      <div className="card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="section-num">{activeShift ? '3' : '2'}</span>
            <span className="section-label">{t.shiftHistory}</span>
          </div>
          <span className="badge badge-green">✓ {t.wageProofBadge}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {worker.recentShifts.map((shift, idx) => (
            <div key={idx} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 16px',
              background: 'var(--bg-page)',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--border)',
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{shift.date}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {shift.hours}h total {shift.hours > 8 ? `· +${(shift.hours - 8).toFixed(1)}h OT` : ''}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.05rem' }}>₹{shift.net}</div>
                <span className="badge badge-green" style={{ fontSize: '0.62rem', marginTop: '4px' }}>{shift.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Rate info */}
        <div style={{
          marginTop: '16px', padding: '14px',
          background: 'var(--bg-page)', borderRadius: 'var(--radius-md)',
          border: '1.5px solid var(--border)',
          fontSize: '0.82rem', color: 'var(--text-secondary)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span>Standard Rate</span>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>₹{worker.hourlyRate}/hr</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span>Overtime Rate (1.5×)</span>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>₹{(worker.hourlyRate * 1.5).toFixed(0)}/hr</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Hazard Allowance</span>
            <span style={{ fontWeight: 700, color: 'var(--accent-amber)' }}>₹{worker.hazardRate}/hr</span>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      {isQrModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px',
        }}>
          <div className="card" style={{ maxWidth: '360px', width: '100%', padding: '32px', textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '6px' }}>Scan Worksite QR Code</div>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Point camera at site entrance barcode or verify GPS
            </div>
            <div style={{
              width: '180px', height: '180px', margin: '0 auto 24px',
              border: '2px dashed var(--border-dark)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: 'var(--bg-page)', position: 'relative', overflow: 'hidden',
            }}>
              <span style={{ fontSize: '60px' }}>📱</span>
              {qrScanning && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                  background: 'var(--accent-black)', animation: 'pulseDot 1.2s infinite',
                }} />
              )}
            </div>
            {qrScanning
              ? <div style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>🔄 Locking GPS geofence...</div>
              : <div style={{ fontWeight: 700, color: 'var(--accent-green)', fontSize: '0.9rem' }}>✅ {qrSuccessMessage}</div>
            }
            <button onClick={() => setIsQrModalOpen(false)} className="btn-outline" style={{ marginTop: '20px', width: '100%' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
