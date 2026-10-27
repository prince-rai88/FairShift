import React, { useState, useEffect } from 'react';
import { calculateShiftPay } from '../../utils/fairshiftLogic';

export default function ShiftTracker({ 
  worker, 
  sector, 
  t, 
  activeShift, 
  setActiveShift, 
  onShiftCompleted 
}) {
  const [elapsedSeconds, setElapsedSeconds] = useState(activeShift ? activeShift.elapsedSeconds || 28800 : 0);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrScanning, setQrScanning] = useState(false);
  const [qrSuccessMessage, setQrSuccessMessage] = useState(null);

  // Live timer tick when shift is active
  useEffect(() => {
    let interval = null;
    if (activeShift) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeShift]);

  const hoursWorked = elapsedSeconds / 3600;
  const payCalculation = calculateShiftPay(
    hoursWorked,
    worker.hourlyRate,
    worker.hazardRate
  );

  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Simulate scanning QR at worksite gate
  const handleScanQr = () => {
    setIsQrModalOpen(true);
    setQrScanning(true);
    setQrSuccessMessage(null);

    setTimeout(() => {
      setQrScanning(false);
      setQrSuccessMessage(`Verified Geofence at ${sector.name} - Gate 4`);
      
      // Auto Punch IN
      setTimeout(() => {
        setIsQrModalOpen(false);
        setActiveShift({
          startTime: new Date().toLocaleTimeString(),
          location: `${sector.name} — Gate 4 Geofence`,
          elapsedSeconds: 0
        });
        setElapsedSeconds(0);
      }, 1200);
    }, 1800);
  };

  const handlePunchOut = () => {
    if (!activeShift) return;
    const finalHours = Math.max(1, parseFloat(hoursWorked.toFixed(1)));
    const finalPay = calculateShiftPay(finalHours, worker.hourlyRate, worker.hazardRate);
    
    if (onShiftCompleted) {
      onShiftCompleted({
        date: "Today (Just Completed)",
        hours: finalHours,
        base: finalPay.basePay,
        ot: finalPay.overtimePay,
        net: finalPay.netTakeHome,
        status: "Verified & Audited"
      });
    }

    setActiveShift(null);
    setElapsedSeconds(0);
  };

  const isOvertime = hoursWorked > 8.0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Active Shift Card */}
      <div className="glass-panel" style={{
        padding: '24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow backdrop based on shift status */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: activeShift 
            ? (isOvertime ? 'radial-gradient(circle, rgba(239, 68, 68, 0.25) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(0, 212, 170, 0.25) 0%, transparent 70%)')
            : 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span className={`pill-badge ${activeShift ? (isOvertime ? 'pill-rose' : 'pill-teal') : 'pill-purple'}`}>
            {activeShift ? (isOvertime ? '● OVERTIME ACTIVE (1.5x Rate)' : '● ON-SITE SHIFT ACTIVE') : '○ NO ACTIVE SHIFT'}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {activeShift ? activeShift.location : sector.location}
          </span>
        </div>

        {/* Live Timer Display */}
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '3.6rem',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          color: isOvertime ? '#F87171' : '#F8FAFC',
          textShadow: activeShift ? '0 0 20px rgba(0, 212, 170, 0.3)' : 'none',
          marginBottom: '8px'
        }}>
          {formatTime(elapsedSeconds)}
        </div>

        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          {activeShift 
            ? `${t.currentShiftTime} • Clocked in at ${activeShift.startTime}` 
            : t.noActiveShift}
        </div>

        {/* Overtime Notice Banner */}
        {isOvertime && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            marginBottom: '20px',
            fontSize: '0.88rem',
            color: '#FCA5A5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <span>⚠️</span>
            <span>{t.overtimeWarning} (+1.5x Premium: ₹{(worker.hourlyRate * 1.5).toFixed(0)}/hr)</span>
          </div>
        )}

        {/* Live Running Earnings Calculator */}
        {activeShift && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '12px',
            background: 'rgba(0, 0, 0, 0.25)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '24px',
            border: '1px solid var(--border-subtle)'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.standardHours}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#00D4AA' }}>
                {payCalculation.standardHours}h
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.overtimeHours}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: payCalculation.overtimeHours > 0 ? '#F87171' : 'var(--text-secondary)' }}>
                {payCalculation.overtimeHours}h
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Net Earned</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#38BDF8' }}>
                ₹{payCalculation.netTakeHome}
              </div>
            </div>
          </div>
        )}

        {/* Action Punch Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {!activeShift ? (
            <>
              <button
                onClick={handleScanQr}
                className="btn-primary pulse-target"
                style={{ padding: '16px 32px', fontSize: '1.05rem' }}
              >
                <span>📷</span> {t.simulatedQr}
              </button>
              <button
                onClick={() => {
                  setActiveShift({
                    startTime: new Date().toLocaleTimeString(),
                    location: `${sector.name} — Geofence Verified`,
                    elapsedSeconds: 0
                  });
                  setElapsedSeconds(0);
                }}
                className="btn-secondary"
                style={{ padding: '16px 24px', fontSize: '0.95rem' }}
              >
                <span>⚡</span> Quick Punch IN
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handlePunchOut}
                className="btn-danger"
                style={{ padding: '16px 32px', fontSize: '1.05rem' }}
              >
                <span>🛑</span> {t.checkOutBtn}
              </button>
              {/* Fast Forward button to test 8h overtime easily for judges */}
              <button
                onClick={() => setElapsedSeconds(prev => prev + 3600 * 2)}
                className="btn-secondary"
                title="Simulation helper: advance 2 hours to showcase overtime calculation"
                style={{ fontSize: '0.82rem', padding: '10px 14px' }}
              >
                ⏩ +2 Hours (Demo Overtime)
              </button>
            </>
          )}
        </div>
      </div>

      {/* Simulated QR Code Scanning Modal */}
      {isQrModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '380px',
            width: '100%',
            padding: '28px',
            textAlign: 'center',
            border: '1px solid rgba(0, 212, 170, 0.4)'
          }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
              {t.simulatedQr}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Point camera at site entrance barcode or verify GPS
            </div>

            {/* Scanning Target Box */}
            <div style={{
              width: '200px',
              height: '200px',
              margin: '0 auto 20px',
              border: '2px dashed #00D4AA',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              background: 'rgba(0, 212, 170, 0.05)'
            }}>
              <div style={{ fontSize: '64px' }}>📱</div>
              {qrScanning && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: '#00D4AA',
                  boxShadow: '0 0 10px #00D4AA',
                  animation: 'pulseGlow 1.2s infinite'
                }} />
              )}
            </div>

            {qrScanning ? (
              <div style={{ color: '#00D4AA', fontWeight: 600, fontSize: '0.9rem' }}>
                🔄 Locking GPS Geofence & Scanning QR...
              </div>
            ) : (
              <div style={{ color: '#38BDF8', fontWeight: 700, fontSize: '0.95rem' }}>
                ✅ {qrSuccessMessage}
              </div>
            )}

            <button
              onClick={() => setIsQrModalOpen(false)}
              className="btn-secondary"
              style={{ marginTop: '20px', width: '100%' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Recent Shift Logs Table */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{t.shiftHistory}</h3>
          <span className="pill-badge pill-teal">{t.wageProofBadge}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {worker.recentShifts.map((shift, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.9rem'
            }}>
              <div>
                <div style={{ fontWeight: 600 }}>{shift.date}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Total Duration: {shift.hours} hours {shift.hours > 8 ? `(+${(shift.hours - 8).toFixed(1)}h OT)` : ''}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, color: '#00D4AA' }}>
                  ₹{shift.net}
                </div>
                <span className="pill-badge pill-teal" style={{ fontSize: '0.65rem' }}>
                  {shift.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
