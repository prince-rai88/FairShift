import React, { useState } from 'react';
import Header from './components/Header';
import WorkerPortal from './components/worker/WorkerPortal';
import AdminDashboard from './components/admin/AdminDashboard';
import { translations } from './i18n/translations';
import { sectors, initialWorkers, initialHazards, initialFeedbacks } from './data/mockData';

export default function App() {
  const [currentLang, setLang] = useState('en');
  const [activeRole, setActiveRole] = useState('worker');
  const [activeSector, setActiveSector] = useState('construction');

  const t = translations[currentLang] || translations.en;

  // Domain State (Modular Initial State)
  const [workers, setWorkers] = useState(initialWorkers);
  const [hazards, setHazards] = useState(initialHazards);
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks);

  // State: Active Shift for current logged in worker
  const [activeShift, setActiveShift] = useState({
    startTime: "08:00 AM",
    location: "MegaInfra Site Alpha — Gate 4 Geofence",
    elapsedSeconds: 28800 // 8 hours preloaded so judges can test overtime in 1 click!
  });

  // Current active worker matching the selected sector
  const currentWorker = workers.find(w => w.sector === activeSector) || workers[0];
  const currentSector = sectors[activeSector] || sectors.construction;

  // Handlers
  const handleReportHazard = (newHazardData) => {
    const newEntry = {
      id: `HAZ-${String(hazards.length + 1).padStart(3, '0')}`,
      reportedBy: "Anonymous Worker (Protected)",
      status: "In Triage",
      timestamp: "Just Now",
      ...newHazardData
    };
    setHazards(prev => [newEntry, ...prev]);
  };

  const handleResolveHazard = (hazardId) => {
    setHazards(prev => prev.map(h => h.id === hazardId ? { ...h, status: "Resolved & Inspected" } : h));
  };

  const handleSubmitFeedback = (newFeedbackData) => {
    const newEntry = {
      id: `FB-${feedbacks.length + 101}`,
      timestamp: "Just Now",
      ...newFeedbackData
    };
    setFeedbacks(prev => [newEntry, ...prev]);
  };

  const handleAddSkill = (skillData) => {
    const newSkill = {
      id: `s${Date.now()}`,
      title: skillData.title,
      issuer: skillData.issuer,
      date: new Date().toISOString().split('T')[0],
      verified: true
    };
    setWorkers(prev => prev.map(w => w.id === currentWorker.id ? {
      ...w,
      skills: [...w.skills, newSkill]
    } : w));
  };

  const handleShiftCompleted = (shiftRecord) => {
    setWorkers(prev => prev.map(w => w.id === currentWorker.id ? {
      ...w,
      recentShifts: [shiftRecord, ...w.recentShifts],
      totalHours: w.totalHours + shiftRecord.hours
    } : w));
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <Header
        currentLang={currentLang}
        setLang={setLang}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        activeSector={activeSector}
        setActiveSector={setActiveSector}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '32px 24px' }}>
        {activeRole === 'worker' ? (
          <WorkerPortal
            worker={currentWorker}
            sector={currentSector}
            t={t}
            currentLang={currentLang}
            activeShift={activeShift}
            setActiveShift={setActiveShift}
            hazards={hazards}
            onReportHazard={handleReportHazard}
            onSubmitFeedback={handleSubmitFeedback}
            onAddSkill={handleAddSkill}
            onShiftCompleted={handleShiftCompleted}
          />
        ) : (
          <AdminDashboard
            workers={workers}
            sectors={sectors}
            hazards={hazards}
            feedbacks={feedbacks}
            activeSector={activeSector}
            t={t}
            onResolveHazard={handleResolveHazard}
          />
        )}
      </main>

      {/* Global Hackathon Footer */}
      <footer style={{
        borderTop: '1.5px solid var(--border)',
        background: '#FFFFFF',
        padding: '16px 24px',
        fontSize: '0.82rem',
        color: 'var(--text-secondary)'
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚡ Built for <strong>Prompt Wars 2026</strong> × SRM ACM Student Chapter</span>
            <span>•</span>
            <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>UN SDG 8: Decent Work & Economic Growth</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>Dual Interfaces: Worker & Employer</span>
            <span>•</span>
            <span>Cross-Industry: Construction & Hospital</span>
            <span>•</span>
            <span style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>Google Cloud Run Ready ☁️</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
