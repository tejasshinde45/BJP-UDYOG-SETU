# BJP Udyog Setu (भाजपा उद्योग सेतू)
> **महाराष्ट्र राज्य औद्योगिक सहकार्य व संवाद पुढाकार | Supporting Maharashtra's $1 Trillion Economy Mission**

BJP Udyog Setu is a Marathi-first industrial engagement and facilitation demonstration platform connecting entrepreneurs, MSME manufacturing units, industrial associations, and state leadership.

---

## 🏛️ Design System & Palette

- **Primary Saffron**: `#E35914` (Hero accents, primary CTAs, active highlights)
- **Secondary Green**: `#136938` (Success states, positive metrics, environmental/cluster badges)
- **Tertiary Gold**: `#F59E0B` (Advisory tags, policy conclave markers)
- **Neutral Dark**: `#111827` (Headings, primary typography)
- **Muted Text**: `#64748B` (Secondary descriptions, metadata)
- **Main Background**: `#FFFFFF`
- **Secondary Tint**: `#F4F7FF` / `#F8FAFC`
- **Borders**: `#E2E8F0`

### Typography
- **Marathi**: `Noto Sans Devanagari`
- **English**: `Noto Sans`
- **Labels & Numbers**: `Inter`

---

## 🗺️ Routes & Pages

| Route | Page | Purpose |
|---|---|---|
| `/` | **मुख्यपृष्ठ (Home)** | Mission hero with video toggle, 3 leadership cards, 4 core service cards, live metrics, ecosystem roadmap, event previews, association CTA |
| `/udyog-samvaad` | **उद्योग संवाद (Udyog Samvaad)** | Industry dialogue sessions, district filtering, detailed agenda, RSVP registration with unique demo reference |
| `/udyog-darshan` | **उद्योग दर्शन (Udyog Darshan)** | Industrial study tours (JNPA Port, MIHAN Aerospace), itineraries, safety regulations, and participant registration |
| `/grievance` | **तक्रार निवारण (Grievance Redressal)** | 4-step grievance wizard: Business details, complaint categorization, file attachments, review & collision-resistant reference generation (`DEMO-GRV-XXXX`) |
| `/track-complaint` | **तक्रार पाठपुरावा (Complaint Tracking)** | Status lookup, sample shortcuts, resolution timeline, coordinator attribution, and 1st & 2nd follow-up submission |
| `/meeting-request` | **नेतृत्व भेटीची विनंती (Meeting Request)** | Wishlist / Leadership meeting appointment request with preferred leader selector, character counter, and disclaimer |
| `/association-registration` | **उद्योग संघटना नोंदणी (Association Registration)** | Regional chamber & cluster association registration form with pending verification state |
| `/niti-manthan` | **नीती मंथन (Niti Manthan)** | Policy roundtables, draft whitepapers, and sector recommendation feedback |
| `/events` | **कार्यक्रम व उपक्रम (Events Hub)** | Central calendar for upcoming and past events with category filters and RSVP |
| `/admin` | **प्रशासक डॅशबोर्ड (Demo Admin)** | Operations dashboard with Recharts analytics, coordinator assignment, status transitions, follow-up inspection, and live derived totals |

---

## ⚙️ Shared Demo Data Architecture

Public form submissions and the admin operations dashboard use the **same central reactive state** (`DemoDataContext`), with persistent browser session storage:

- **Grievances**: Pre-seeded with realistic Maharashtra industrial bottlenecks (MIDC Bhosari, Waluj, Butibori, Ambad). Newly submitted grievances immediately receive a tracking ID and appear in the Admin Dashboard.
- **Follow-ups**: Submitting a 1st or 2nd follow-up from `/track-complaint` immediately updates the shared record, adds an entry to the visual timeline, and reflects in the Admin panel.
- **Meeting Requests**: Submissions from `/meeting-request` appear under Meeting Management in `/admin` where administrators can set review decisions and notes.
- **Association Registrations**: Registrations appear under Association Management with verification status controls.
- **Event RSVPs**: Event registrations automatically increment event participant counters and log delegate details.
- **Reset Sample Data**: A button in the Admin header and top banner allows instant restoration to default mock data.

---

## 🌐 Multilingual Support

- **Default Language**: Marathi (`mr`)
- **Supported Languages**: Marathi (`mr`), Hindi (`hi`), English (`en`)
- Managed centrally via `LanguageContext` and `src/translations/index.ts`, persisting the user's preference in `localStorage`.

---

## ⚠️ Demonstration Limitations & Disclaimers

- **Frontend Demonstration**: This application is a client prototype created for interaction and design verification.
- **No External Backend**: No data is transmitted to an actual government department, political leadership office, or remote server.
- **No File Storage**: File attachments in the grievance form are handled for metadata demonstration only (filenames and sizes); files are not uploaded.
- **Simulated Approvals**: Status updates and verification actions are purely illustrative.

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Run Oxlint
npm run lint

# Build for production
npm run build
```
"# BJP-UDYOG-SETU" 
