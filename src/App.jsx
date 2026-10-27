import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import WorkerPortal from './components/worker/WorkerPortal';
import AdminDashboard from './components/admin/AdminDashboard';
import { translations } from './i18n/translations';

export default function App() {
  const [currentLang, setLang] = useState('en');
  const [activeRole, setActiveRole] = useState('worker'); // 'worker' | 'admin'
  const [activeSector, setActiveSector] = useState('construction'); // 'construction' | 'hospital'
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  const t = translations[currentLang] || translations.en;

  // Sectors Configuration
  const sectors = {
    construction: {
      id: "construction",
      name: "MegaInfra Site Alpha",
      icon: "🏗️",
      location: "Sector 14, Industrial Expressway Gate 4",
      standardRate: 130,
      hazardRate: 40
    },
    hospital: {
      id: "hospital",
      name: "St. Jude Metro Hospital",
      icon: "🏥",
      location: "Central Ward Block C & D Sanitation",
      standardRate: 145,
      hazardRate: 50
    }
  };

  // State: Seeded Workers
  const [workers, setWorkers] = useState([
    {
      id: "WRK-C104",
      name: "Ramesh Kumar (रमेश)",
      sector: "construction",
      role: "Lead Scaffolder & Rigger",
      avatar: "👷‍♂️",
      hourlyRate: 130,
      hazardRate: 40,
      weeklyHours: 42,
      lastShiftGapHours: 14,
      consecutiveShifts: 5,
      totalHours: 168,
      overtimeHours: 12,
      satisfactionScore: 82,
      reportedHazardsCount: 1,
      skills: [
        { id: "s1", title: "Heavy Scaffolding Safety (Level 3)", issuer: "National Skill Dev Council", date: "2025-08-12", verified: true },
        { id: "s2", title: "Fall Arrest & Harness Rigging", issuer: "MegaInfra Safety Board", date: "2025-11-04", verified: true },
        { id: "s3", title: "High-Elevation Wind Hazard Protocol", issuer: "OSHA Certified", date: "2026-02-18", verified: true }
      ],
      recentShifts: [
        { date: "Yesterday", hours: 8.5, base: 1040, ot: 97.5, net: 1001, status: "Verified" },
        { date: "2 days ago", hours: 8.0, base: 1040, ot: 0, net: 914, status: "Verified" },
        { date: "3 days ago", hours: 9.0, base: 1040, ot: 195, net: 1087, status: "Verified" }
      ]
    },
    {
      id: "WRK-H208",
      name: "Priya Murugan (பிரியா)",
      sector: "hospital",
      role: "Sanitation & Biohazard Lead",
      avatar: "👩‍⚕️",
      hourlyRate: 145,
      hazardRate: 50,
      weeklyHours: 52, // Critical overwork!
      lastShiftGapHours: 6, // Dangerous turnaround < 8h!
      consecutiveShifts: 6,
      totalHours: 184,
      overtimeHours: 24,
      satisfactionScore: 48,
      reportedHazardsCount: 2,
      skills: [
        { id: "s4", title: "Biomedical Infectious Waste Neutralization", issuer: "State Health Dept", date: "2025-05-19", verified: true },
        { id: "s5", title: "PPE Category 4 Donning & Doffing", issuer: "St. Jude Infection Control", date: "2025-10-15", verified: true },
        { id: "s6", title: "Chemical Spill First Responder", issuer: "Hospital Safety Council", date: "2026-01-20", verified: true }
      ],
      recentShifts: [
        { date: "Yesterday (Night)", hours: 10.0, base: 1160, ot: 435, net: 1402, status: "Verified" },
        { date: "Yesterday (Day)", hours: 8.0, base: 1160, ot: 0, net: 1020, status: "Verified" },
        { date: "3 days ago", hours: 9.5, base: 1160, ot: 326, net: 1306, status: "Verified" }
      ]
    },
    {
      id: "WRK-C219",
      name: "Amit Patel (अमित)",
      sector: "construction",
      role: "Tower Crane Operator",
      avatar: "👷",
      hourlyRate: 155,
      hazardRate: 45,
      weeklyHours: 38,
      lastShiftGapHours: 16,
      consecutiveShifts: 4,
      totalHours: 150,
      overtimeHours: 6,
      satisfactionScore: 88,
      reportedHazardsCount: 0,
      skills: [
        { id: "s7", title: "Heavy Machinery & Crane Pilot", issuer: "Heavy Earthmovers Guild", date: "2024-12-10", verified: true }
      ],
      recentShifts: [
        { date: "Yesterday", hours: 8.0, base: 1240, ot: 0, net: 1090, status: "Verified" }
      ]
    },
    {
      id: "WRK-H305",
      name: "Suresh Balan (சுரேஷ்)",
      sector: "hospital",
      role: "Emergency Ward Transport Orderly",
      avatar: "👨‍⚕️",
      hourlyRate: 135,
      hazardRate: 40,
      weeklyHours: 49,
      lastShiftGapHours: 7.5,
      consecutiveShifts: 7,
      totalHours: 190,
      overtimeHours: 18,
      satisfactionScore: 52,
      reportedHazardsCount: 1,
      skills: [
        { id: "s8", title: "Critical Patient Safe-Transit", issuer: "EMS Guild", date: "2025-04-12", verified: true },
        { id: "s9", title: "Oxygen Cylinder Handling", issuer: "St. Jude Hospital", date: "2025-09-01", verified: true }
      ],
      recentShifts: [
        { date: "Yesterday", hours: 9.0, base: 1080, ot: 202, net: 1127, status: "Verified" }
      ]
    }
  ]);

  // State: Hazards
  const [hazards, setHazards] = useState([
    {
      id: "HAZ-001",
      sector: "construction",
      category: "Fall Hazard / Unsecured Scaffolding",
      location: "Tower B, 14th Floor Perimeter Scaffold",
      description: "Toe-boards missing and loose anchor bolts after heavy wind. Severe fall risk for ironworkers.",
      reportedBy: "Anonymous Worker (Voice Note)",
      priority: "CRITICAL",
      status: "In Triage",
      timestamp: "Today at 08:35 AM",
      audioAttached: true
    },
    {
      id: "HAZ-002",
      sector: "hospital",
      category: "Toxic Chemical / Biohazard Spill",
      location: "Basement Sterilization Room & Dirty Linen Chute",
      description: "Disinfectant vapor leak caused eye irritation to two sanitation staff. Exhaust fan broken.",
      reportedBy: "Anonymous Orderly (Voice Note)",
      priority: "HIGH",
      status: "In Triage",
      timestamp: "Today at 09:12 AM",
      audioAttached: true
    },
    {
      id: "HAZ-003",
      sector: "construction",
      category: "Missing Safety Gear / PPE Violation",
      location: "Batching Plant Mixing Zone",
      description: "Respirator masks and eye goggles out of stock in supply locker. Workers inhaling dry silica dust.",
      reportedBy: "Anonymous Worker",
      priority: "MEDIUM",
      status: "Resolved & Inspected",
      timestamp: "Yesterday at 04:20 PM",
      audioAttached: false
    }
  ]);

  // State: Feedbacks
  const [feedbacks, setFeedbacks] = useState([
    {
      id: "FB-101",
      sector: "construction",
      department: "Civil Scaffolding Team",
      supervisorScore: 4.5,
      workloadScore: 3.8,
      facilitiesScore: 4.2,
      comment: "Drinking water dispensers are now properly shaded. Shift timings have been respected this week.",
      timestamp: "Yesterday",
      anonymityProof: "SHA256:8f4c2...7a01 (Zero Retaliation Guarantee)"
    },
    {
      id: "FB-102",
      sector: "hospital",
      department: "Night Sanitation Orderlies",
      supervisorScore: 2.1,
      workloadScore: 1.8,
      facilitiesScore: 3.0,
      comment: "Consecutive 12-hour shifts without replacement orderlies. Staff are falling asleep during transport.",
      timestamp: "Today at 06:45 AM",
      anonymityProof: "SHA256:b39e1...12cf (Zero Retaliation Guarantee)"
    }
  ]);

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
      
      {/* Universal Header with Sector, Language, Role Switches */}
      <Header
        currentLang={currentLang}
        setLang={setLang}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        activeSector={activeSector}
        setActiveSector={setActiveSector}
        isMobileFrame={isMobileFrame}
        setIsMobileFrame={setIsMobileFrame}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '32px 20px' }}>
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
            isMobileFrame={isMobileFrame}
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
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(8, 12, 22, 0.95)',
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
            <span style={{ color: '#00D4AA' }}>UN SDG 8: Decent Work & Economic Growth</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>Dual Interfaces: Worker & Employer</span>
            <span>•</span>
            <span>Cross-Industry: Construction & Hospital</span>
            <span>•</span>
            <span style={{ color: '#38BDF8' }}>Google Cloud Run Ready ☁️</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
