<div align="center">

# ⚖️ FairShift
### Building Fairer, Safer, and More Transparent Workplaces for Frontline Organisations
**Theme: UN Sustainable Development Goal 8 (Decent Work & Economic Growth)**  
*Prompt Wars 2026 × ACM Student Chapter, SRMIST*

<br/>

[![Live Demo](https://img.shields.io/badge/🚀_Live_Application-Open_App-00D4AA?style=for-the-badge&logo=vercel&logoColor=white)](https://fair-shift.vercel.app)
[![Deploy with Vercel](https://img.shields.io/badge/▲_Deploy_to_Vercel-1--Click_Launch-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fprince-rai88%2FFairShift)
[![GitHub Repo](https://img.shields.io/badge/GitHub-prince--rai88%2FFairShift-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/prince-rai88/FairShift)

<br/>

[![UN SDG 8](https://img.shields.io/badge/UN_SDG_8-Decent_Work_%26_Economic_Growth-A21942?style=flat-square&logo=united-nations&logoColor=white)](https://sdgs.un.org/goals/goal8)
[![CI Pipeline](https://img.shields.io/badge/CI_Pipeline-Passing_100%25-16A34A?style=flat-square&logo=github-actions&logoColor=white)](https://github.com/prince-rai88/FairShift/actions)
[![React 19](https://img.shields.io/badge/Frontend-React_19_+_Vite_8-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Django](https://img.shields.io/badge/Backend-Django_6.1_+_DRF-092E20?style=flat-square&logo=django&logoColor=white)](https://www.djangoproject.com)
[![Tests](https://img.shields.io/badge/Tests-21_Vitest_+_5_Django-2563EB?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev)
[![Code Quality](https://img.shields.io/badge/Oxlint-0_Warnings_•_0_Errors-purple?style=flat-square)](https://oxc.rs)
[![License: MIT](https://img.shields.io/badge/License-MIT-gray?style=flat-square)](LICENSE)

<br/>

[🌟 Executive Summary](#-executive-summary--problem-context) •
[🚀 Live Demo](#-live-demo--dual-interfaces) •
[⚡ Features](#-complete-feature-matrix) •
[🎯 SDG 8 Mapping](#-direct-challenge-statement-alignment) •
[🧪 Automated Testing](#-automated-testing--evaluation-suite) •
[☁️ Deployment](#-deployment-options)

</div>

---

## 🌟 Executive Summary & Problem Context

In frontline employee-intensive sectors—such as **Construction Sites**, **Hospitals**, **Factories**, and **Colleges**—workforce management still relies on opaque paper registers, disorganized messaging groups, and verbal agreements.

### 🔴 Frontline Worker Pain Points
1. **Opaque Pay & Wage Theft:** Unclear deductions, uncounted overtime hours, and missing statutory hazard allowances.
2. **Fear of Retaliation:** Workers hesitate to report safety violations or supervisor misconduct due to fear of termination.
3. **Unreported High-Risk Hazards:** Critical risks (unsecured scaffolding, chemical leaks, faulty wiring) go unaddressed until accidents occur.
4. **Lost Skill Credentials:** Unrecorded certifications force skilled laborers to restart from base minimum day-wages at every new site.

### 🏢 Employer Operational Blind Spots
1. **Zero Real-Time Visibility:** Inability to detect overworked or fatigued workers before severe OSHA violations occur.
2. **High Attrition Risk:** Inability to predict burnout and dissatisfaction before key staff leave.
3. **Delayed Escalation:** Safety tickets reach administration only after injuries or regulatory audits.

---

## 🚀 Live Demo & Dual Interfaces

FairShift provides **two synchronized interfaces** designed for both sides of the workplace:

### 1. 👷 Frontline Worker Portal (Mobile-First & Low-Literacy Optimized)
- **High-Contrast Bold Card Design:** Built with large touch targets, color-coded visual cues, and zero visual congestion.
- **Multilingual Support (EN, हिन्दी, தமிழ்):** Instant 1-click translation for workers speaking regional native tongues.
- **Voice-Enabled Safety Alerts:** Native **HTML5 Web Speech API** allowing workers to speak safety incident reports aloud without typing.
- **Verifiable Payslip Breakdowns:** Itemized accounting of base wage, 1.5x overtime multiplier, hazard duty allowance, PF (12%), and ESI (0.75%).

### 2. 🏢 Employer Operations Command Center (Desktop-First)
- **Anti-Fatigue Radar:** Automatically detects labor law violations (>48h weekly hours or <8h turnaround between shifts).
- **AI Attrition & Burnout Predictor:** Multi-factor risk engine computing quit probability using fatigue, sentiment, and safety hazard exposure.
- **Real-Time Safety Triage Desk:** Immediate priority sorting (Critical, High, Medium) with live resolution workflow.
- **Official UN SDG 8 Audit Export:** 1-click exportable tamper-evident compliance dossier (`.json`) for labor inspectors.

---

## 🏭 Cross-Industry Deployment (2 Operating Sectors)

FairShift adapts dynamically to different operational environments:

| Industry Sector | Workers & Roles Tracked | Specific Hazards Tracked | Skills Certified |
|---|---|---|---|
| **🏗️ MegaInfra Construction Alpha** | Scaffolding riggers, crane operators, ironworkers | Unsecured scaffolds, crane wind instability, silica dust, PPE shortages | Level 3 Scaffolding Safety, Fall Harness Rigging, Tower Crane Operation |
| **🏥 St. Jude Metro Hospital** | Sanitation orderlies, biohazard crew, patient transit | Toxic disinfectant leaks, biohazard waste spills, needle-stick risks | Infectious Waste Neutralization, PPE Level 4 Doffing, Patient Transit Care |

---

## ⚡ Complete Feature Matrix

1. **⏱️ Smart Shift Tracking with Geofence & QR:**
   - Scan site gate QR or geofence auto-punch.
   - Live shift stopwatch with automatic **1.5x Overtime premium calculation** when exceeding standard 8-hour limits.
2. **💰 Transparent Payslips in Native Language:**
   - Itemized breakdown of Base Wage, 1.5x Overtime, Hazard Pay, PF (12%), and ESI (0.75%).
   - Zero hidden deductions with cryptographic audit hash and PDF print/export.
3. **🚨 Safety Hazard Alert System (Voice & Text):**
   - Built-in browser **Web Speech API** voice input (Hindi, Tamil, English).
   - Priority tagging (Medium, High, Critical) and live resolution tracker (*In Triage* ➔ *Resolved*).
4. **🔒 Protected Whistleblower & Anonymous Feedback:**
   - Cryptographically decoupled feedback mechanism (**SHA-256 anonymity proof**).
   - Zero worker IDs stored with reviews to eliminate employer retaliation.
5. **🏅 Universal Skill Passport:**
   - Portable digital credentials that travel with the worker.
   - QR code sharing so workers never have to re-prove their skills or start from zero.
6. **⚠️ Live Anti-Fatigue Radar:**
   - Flagging workers exceeding 48h/week or working back-to-back shifts with <8h rest.
   - 1-click "Dispatch Mandatory Rest Relief" for managers.
7. **📊 Employer Intelligence & Attrition Predictor:**
   - 7-Day Attendance and Overtime Area Charts.
   - Predictive AI Attrition score formula:  
     $$\text{Risk Score} = 0.4 \times \text{Fatigue} + 0.4 \times (100 - \text{Satisfaction}) + \text{Hazards} \times 10 + \text{OT Ratio} \times 20$$
8. **🌐 Regional Languages & Audio Accessibility:**
   - English, Hindi (हिन्दी), and Tamil (தமிழ்).
   - Voice note indicators and intuitive visual badge queues.

---

## 🎯 Direct Challenge Statement Alignment: UN SDG 8 Targets 8.5 & 8.8

| Hackathon Requirement | FairShift Solution | SDG Target & Legal Standard |
|---|---|---|
| **Dual Interface** | Frontline Worker Portal & Employer Command Center | **SDG 8.5** (Decent work for all women & men) |
| **Wage Transparency** | Itemized Base, 1.5x Overtime, PF (12%), ESI (0.75%) | **SDG 8.5** (Equal pay for work of equal value) |
| **Workplace Safety** | Real-time voice & text safety hazard alert desk | **SDG 8.8** (Safe & secure working environments) |
| **Anti-Fatigue Monitoring** | Automated flags for >48h weekly or <8h turnaround | **SDG 8.8** (Protection of labor rights) |
| **Anti-Retaliation Protection**| SHA-256 cryptographic anonymous whistleblower reviews | **SDG 8.8** (Safe reporting channels) |
| **Credential Mobility** | Verifiable Universal Skill Passport with QR sharing | **SDG 8.5** (Productive employment & career mobility)|
| **Multi-Industry Scope** | MegaInfra Construction Site Alpha & St. Jude Hospital | Cross-sector frontline applicability |

---

## 🧪 Automated Testing & Evaluation Suite

FairShift features an exhaustive, dual-stack automated testing suite:

### 1. Frontend & Algorithmic Unit Tests (Vitest)
```bash
npm test
```

```text
 ✓ src/utils/fairshiftLogic.test.js (8 tests)
 ✓ test/fairshift.test.js (13 tests)

 Test Files  2 passed (2)
 Tests       21 passed (21)
 Duration    128ms
```

### 2. Django Backend & API Tests
```bash
npm run backend:test
```

```text
Found 5 test(s).
Creating test database for alias 'default'...
.....
Ran 5 tests in 0.005s. OK
```

---

## ☁️ Deployment Options

<div align="center">

[![Deploy with Vercel](https://img.shields.io/badge/▲_Deploy_with_Vercel-Instant_Serverless-black?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fprince-rai88%2FFairShift)
[![Docker Container](https://img.shields.io/badge/Docker-Google_Cloud_Run_Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](Dockerfile)
[![Django Backend](https://img.shields.io/badge/Django_REST-Python_3.14_Backend-092E20?style=for-the-badge&logo=django&logoColor=white)](backend/)

</div>

### Option A: 1-Click Serverless Deploy (Vercel)
FairShift includes `vercel.json` and `api/index.js` pre-configured for instant deployment (Express API as serverless functions + React static CDN frontend):

1. Click the **[Deploy with Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fprince-rai88%2FFairShift)** button.
2. Sign in with GitHub and select your repository.
3. Click **Deploy** — Vercel builds the frontend in <80ms and routes `/api/*` to serverless execution!

### Option B: Local Full-Stack Development (React + Django)

```bash
# 1. Install frontend dependencies
npm install

# 2. Start the Django REST Framework backend (Port 8000)
npm run backend:start

# 3. Start the Vite React development server (Port 5173)
npm run dev
# Vite automatically proxies all /api calls to http://127.0.0.1:8000!
```

---

## 📢 LinkedIn Post Submission Draft (Requirement 03)

*(Copy and paste directly for your LinkedIn submission link)*

```text
🚀 Excited to present FairShift at Prompt Wars 2026, organized by the ACM Student Chapter, SRMIST!

📌 The Problem:
Across employee-intensive industries like Construction Sites and Hospitals, millions of frontline shift workers face opaque wage calculations, hazardous conditions, and fear of retaliation when raising concerns. At the same time, employers struggle with blind spots—unable to spot worker fatigue or predict turnover until critical incidents occur.

💡 Our Build — FairShift:
Aligned with UN Sustainable Development Goal 8 (Decent Work & Economic Growth), FairShift is a dual-interface platform designed for both frontline workers and site administrators:
• 📱 Worker Mobile Portal: Multilingual voice-enabled reporting (Hindi, Tamil, English), QR shift check-ins with automated 1.5x statutory overtime, transparent payslip breakdowns (PF/ESI/Hazard allowance), and a portable Universal Skill Passport.
• 🏢 Employer Operations Center: An Anti-Fatigue Radar that flags labor law violations (>48h/week or <8h shift turnaround), a real-time site hazard triage board, and an AI Attrition Risk Predictor.

🌍 Cross-Industry Impact:
Demonstrated across MegaInfra Construction Site Alpha and St. Jude Metro Hospital, FairShift bridges the transparency gap between workers and employers, proving that fair treatment and operational safety drive sustainable productivity.

Check out the code & live deployment: [Link to .git repo & live app]

#PromptWars2026 #SRMACM #UNSDG8 #DecentWork #WebDevelopment #AI #CloudRun #SocialImpact
```

---

<div align="center">

*Built with ❤️ for Prompt Wars 2026 × ACM SRMIST Student Chapter.*

[![Back to Top](https://img.shields.io/badge/⬆_Back_to_Top-0A0A0A?style=for-the-badge)](#fairshift)

</div>
