# ⚖️ FairShift — Decent Work Platform
### Building Fairer, Safer, and More Transparent Workplaces for Employee-Intensive Organisations
**Theme: UN Sustainable Development Goal 8 (Decent Work & Economic Growth)**  
*Prompt Wars 2026 × SRM ACM Student Chapter Hackathon*

---

## 🌟 Executive Summary & Problem Context

In employee-intensive sectors—such as **Construction Sites**, **Hospitals**, **Colleges**, and **Factories**—workforce management still relies on opaque paper registers, disorganized WhatsApp groups, and verbal agreements.

### Worker Pain Points Tackled
1. **Opaque Pay Calculations:** Unclear deductions, uncounted overtime hours, and missing hazard allowances.
2. **Fear of Retaliation:** Hesitation to report dangerous hazards or supervisor abuse due to fear of termination.
3. **Unreported Safety Hazards:** Critical risks (unsecured scaffolding, biohazard leaks, faulty wiring) ignored until catastrophe strikes.
4. **Lost Career History:** Unrecorded skills force skilled laborers to restart from day-wage minimums at every new job.

### Employer Blind Spots Tackled
1. **Zero Real-Time Visibility:** Inability to spot overworked or fatigued employees before accidents occur.
2. **High Attrition Risk:** Failure to detect burnout and dissatisfaction before key staff quit.
3. **Delayed Escalation:** Safety issues reach management only after severe OSHA/labor violations or injuries.

---

## 🚀 Live Demo & Dual Interfaces

FairShift provides **two synchronized interfaces** catering to both sides of the workplace:

### 1. 👷 Worker Portal (Mobile-First & Low-Literacy Optimized)
- **High Visual Contrast & Voice First:** Built with large touch targets, color-coded visual cues, and native **Web Speech API** voice recognition.
- **Multilingual Support (EN, हिन्दी, தமிழ்):** Instant 1-click translation for workers speaking regional native tongues.
- **Smartphone Frame Simulation Mode:** Built-in mobile preview mode showcasing how the UI renders on low-end smartphones.

### 2. 🏢 Employer Operations Command Center (Desktop-First)
- **Anti-Fatigue Radar:** Automatically detects labor law violations (>48h weekly hours or <8h turnaround between shifts).
- **AI Attrition & Burnout Predictor:** Multi-factor risk engine computing quit probability using fatigue, sentiment, and safety hazard exposure.
- **Real-Time Safety Triage Desk:** Immediate dispatch, inspector assignment, and status resolution for site hazards.
- **Cross-Industry Roster & Analytics:** Unified view across distinct operating sectors.

---

## 🏭 Cross-Industry Deployment (2+ Sectors)

FairShift adapts dynamically to different operational environments:

| Industry Sector | Workers & Roles | Specific Hazards Tracked | Skills Certified |
|---|---|---|---|
| **🏗️ MegaInfra Construction Site Alpha** | Scaffolding riggers, crane operators, ironworkers | Unsecured scaffolds, crane wind instability, silica dust, PPE shortages | Level 3 Scaffolding Safety, Fall Harness Rigging, Tower Crane Operation |
| **🏥 St. Jude Metro Hospital** | Sanitation orderlies, biohazard crew, patient transport | Toxic disinfectant leaks, biohazard waste spills, needle-stick risks | Infectious Waste Neutralization, PPE Level 4 Doffing, Patient Transit Care |

---

## ⚡ Complete Feature Matrix (All 8 Features Built)

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
   - Cryptographically decoupled feedback mechanism (SHA-256 anonymity proof).
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

## 🧪 Automated Testing & Evaluation Suite (21 Tests Passing)

FairShift comes with a **Vitest test suite** validating statutory wage calculations, fatigue violation triggers, attrition algorithms, and server integrity:

```bash
npm test
```

### Test Results (21/21 Passing):
```text
✓ src/utils/fairshiftLogic.test.js (8 tests)
✓ test/fairshift.test.js (13 tests)

Test Files  2 passed (2)
Tests       21 passed (21)
Duration    128ms
```
```

### Evaluation Parameters Addressed:
- **Code Quality:** Modular ES6 architecture, clean component separation, reusable logic in `src/utils/fairshiftLogic.js`.
- **Security:** Zero exposed API keys, zero hardcoded credentials, `.env*` gitignored, cryptographic anonymity proofs.
- **Repository Size:** Strictly **~500 KB** (well under the 10 MB hackathon limit).
- **Single Branch:** Hosted cleanly on `main`.

---

## 🚀 Deployment Instructions

### Option 1: Google Cloud Run (Docker Container)
FairShift includes a multi-stage `Dockerfile` and listens on `process.env.PORT` bound to `0.0.0.0`:

```bash
# 1. Build and tag container
gcloud builds submit --tag gcr.io/[PROJECT_ID]/fairshift

# 2. Deploy to Cloud Run
gcloud run deploy fairshift \
  --image gcr.io/[PROJECT_ID]/fairshift \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

### Option 2: Vercel (Instant 1-Click Serverless Deploy)
FairShift includes `vercel.json` and `api/index.js` pre-configured for instant deployment (Express API as serverless functions + React static frontend):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fprince-rai88%2FFairShift)

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Import **`prince-rai88/FairShift`**
3. Click **Deploy** — Vercel automatically detects Vite, builds `dist/`, and serves `/api/*` endpoints via Serverless Functions!

### Option 3: Local Development
```bash
# Install dependencies
npm install

# Run Vite development server
npm run dev

# Run production Express server
npm run build
npm start
# Open http://localhost:8080
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

*Built with ❤️ for Prompt Wars 2026 × ACM SRMIST Student Chapter.*
