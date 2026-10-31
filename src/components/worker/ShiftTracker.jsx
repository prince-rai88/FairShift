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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* ① SHIFT STATUS */}
        <div className="card" style={{ padding: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="section-num">1</span>
              <span className="section-label">Shift Status</span>
            </div>
            {activeShift && (
              <span className={`badge ${isOvertime ? 'badge-red' : 'badge-green'}`}>
                {isOvertime ? '● OVERTIME ACTIVE (1.5x)' : '● ON-SITE ACTIVE'}
              </span>
            )}
          </div>

          {/* Timer Display with Neon Liquid Glow */}
          <div style={{
            textAlign: 'center',
            marginBottom: '26px',
            padding: '24px 16px',
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-glass)',
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '4.2rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: isOvertime ? '#F87171' : '#38BDF8',
              textShadow: isOvertime
                ? '0 0 35px rgba(239, 68, 68, 0.6)'
                : '0 0 35px rgba(6, 182, 212, 0.5), 0 0 10px rgba(56, 189, 248, 0.4)',
              lineHeight: 1,
              marginBottom: '10px',
            }}>
              {formatTime(elapsedSeconds)}
            </div>
            <div style={{ fontSize: '0.84rem', color: '#94A3B8' }}>
              {activeShift
                ? `On-site since ${activeShift.startTime} · ${activeShift.location}`
                : t.noActiveShift}
            </div>
          </div>

          {/* Overtime notice */}
          {isOvertime && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              fontSize: '0.85rem',
              color: '#FCA5A5',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              ⚠️ {t.overtimeWarning}
            </div>
          )}

          {/* Punch buttons */}
          {!activeShift ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
          <div className="card" style={{ padding: '26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <span className="section-num">2</span>
              <span className="section-label">Live Earnings</span>
            </div>
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '0.74rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px' }}>
                Estimated Net This Shift
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '3rem',
                fontWeight: 800,
                color: '#34D399',
                textShadow: '0 0 30px rgba(52, 211, 153, 0.4)',
                lineHeight: 1,
              }}>
                ₹{payCalculation.netTakeHome}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="glass-subpanel" style={{ padding: '16px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{t.standardHours}</div>
                <div style={{ fontWeight: 700, fontSize: '1.25rem', color: '#38BDF8' }}>{payCalculation.standardHours}h</div>
              </div>
              <div className="glass-subpanel" style={{
                padding: '16px',
                background: payCalculation.overtimeHours > 0 ? 'rgba(239, 68, 68, 0.12)' : undefined,
                borderColor: payCalculation.overtimeHours > 0 ? 'rgba(239, 68, 68, 0.35)' : undefined,
              }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{t.overtimeHours}</div>
                <div style={{ fontWeight: 700, fontSize: '1.25rem', color: payCalculation.overtimeHours > 0 ? '#F87171' : 'var(--text-muted)' }}>{payCalculation.overtimeHours}h</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT — Shift History */}
      <div className="card" style={{ padding: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="section-num">{activeShift ? '3' : '2'}</span>
            <span className="section-label">{t.shiftHistory}</span>
          </div>
          <span className="badge badge-green">✓ {t.wageProofBadge}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {worker.recentShifts.map((shift, idx) => (
            <div key={idx} className="glass-subpanel" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 18px',
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.94rem', color: '#FFFFFF' }}>{shift.date}</div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '2px' }}>
                  {shift.hours}h total {shift.hours > 8 ? `· +${(shift.hours - 8).toFixed(1)}h OT` : ''}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.1rem', color: '#F1F5F9' }}>₹{shift.net}</div>
                <span className="badge badge-green" style={{ fontSize: '0.62rem', marginTop: '4px' }}>{shift.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Rate info */}
        <div className="glass-subpanel" style={{
          marginTop: '20px', padding: '18px',
          fontSize: '0.84rem', color: '#94A3B8',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>Standard Rate</span>
            <span style={{ fontWeight: 700, color: '#FFFFFF' }}>₹{worker.hourlyRate}/hr</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>Overtime Rate (1.5×)</span>
            <span style={{ fontWeight: 700, color: '#38BDF8' }}>₹{(worker.hourlyRate * 1.5).toFixed(0)}/hr</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Hazard Allowance</span>
            <span style={{ fontWeight: 700, color: '#FBBF24' }}>₹{worker.hazardRate}/hr</span>
          </div>
        </div>
      </div>

      {/* QR Modal with 3D liquid backdrop */}
      {isQrModalOpen && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(3, 7, 18, 0.8)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px',
        }}>
          <div className="card" style={{ maxWidth: '380px', width: '100%', padding: '34px', textAlign: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.7), 0 0 40px rgba(6, 182, 212, 0.25)' }}>
            <div style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '8px', color: '#FFFFFF' }}>Scan Worksite QR Code</div>
            <div style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '24px' }}>
              Point camera at site entrance barcode or verify GPS
            </div>
            <div style={{
              width: '190px', height: '190px', margin: '0 auto 24px',
              border: '2px dashed rgba(56, 189, 248, 0.5)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.03)', position: 'relative', overflow: 'hidden',
            }}>
              <span style={{ fontSize: '64px' }}>📱</span>
              {qrScanning && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                  background: 'linear-gradient(90deg, #38BDF8, #06B6D4)',
                  boxShadow: '0 0 12px #38BDF8',
                  animation: 'pulseDot 1.2s infinite',
                }} />
              )}
            </div>
            {qrScanning
              ? <div style={{ fontWeight: 600, color: '#38BDF8', fontSize: '0.92rem' }}>🔄 Locking GPS geofence...</div>
              : <div style={{ fontWeight: 700, color: '#34D399', fontSize: '0.92rem' }}>✅ {qrSuccessMessage}</div>
            }
            <button onClick={() => setIsQrModalOpen(false)} className="btn-outline" style={{ marginTop: '22px', width: '100%' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
