# DeLaxiY v4 — Full-Stack MERN Dashboard
## Figma-Matched Design · MongoDB Compass · Complete MERN Stack

---

## 📁 Project Structure

```
delaxiy-v3/
├── backend/
│   ├── .env                     ← ✅ Already filled in (MONGO_URI + JWT_SECRET)
│   ├── .env.example
│   ├── package.json
│   ├── server.js                ← Express entry point
│   ├── middleware/auth.js        ← JWT protect
│   ├── models/
│   │   ├── User.js              ← bcrypt password hashing
│   │   ├── Order.js             ← Auto CUST-0001 / ORD-0001 IDs
│   │   └── Dashboard.js         ← Per-user widget layouts
│   └── routes/
│       ├── auth.js              ← POST /register, POST /login, GET /me
│       ├── orders.js            ← GET / POST / PUT / DELETE /orders
│       └── dashboard.js         ← GET / PUT /dashboard
│
└── frontend/
    ├── .env                     ← REACT_APP_API_URL=http://localhost:5000/api
    ├── package.json
    ├── public/index.html
    └── src/
        ├── App.js               ← Routing + auth guard
        ├── index.js / index.css ← Entry + design system
        ├── api/index.js         ← All API calls with JWT
        ├── context/             ← Auth, Orders, Dashboard, Toast
        ├── components/
        │   ├── layout/
        │   │   ├── Sidebar.js   ← Dark collapsible sidebar (Figma-matched)
        │   │   └── Topbar.js    ← Page header with user avatar
        │   ├── modals/
        │   │   ├── AuthModal.js ← Login/Register popup
        │   │   ├── OrderModal.js← Create/Edit order (uncontrolled inputs)
        │   │   └── WidgetPanel.js← Widget configurator side panel
        │   └── widgets/
        │       └── WidgetRenderer.js ← KPI/Bar/Line/Area/Scatter/Pie/Table
        ├── pages/
        │   ├── LandingPage.js   ← Animated landing (login keeps as-is)
        │   ├── DashboardPage.js ← Configure mode + view mode
        │   └── OrdersPage.js    ← CUST/ORD IDs, pagination, search
        └── utils/constants.js   ← INR formatters, data helpers
```

---

## 🚀 STEP-BY-STEP SETUP

### Prerequisites
- Node.js v18+
- MongoDB Compass (already installed ✅)
- VS Code

---

### STEP 1 — Open MongoDB Compass
1. Open MongoDB Compass
2. URI: `mongodb://localhost:27017`
3. Click **Connect**

If it says "Connection Refused":
- Press Windows key → type `powershell` → Run as Administrator
- Type: `net start MongoDB`

---

### STEP 2 — Open Project in VS Code
1. Extract ZIP → open folder `delaxiy-v3` in VS Code
2. Press `Ctrl+`` to open terminal

---

### STEP 3 — Start Backend

```powershell
cd backend
npm install
npm run dev
```

You must see:
```
✅ MongoDB connected
🚀 DeLaxiY API on http://localhost:5000
```

Test: open http://localhost:5000/api/health → `{"status":"ok"}`

---

### STEP 4 — Start Frontend

Open a **NEW terminal tab** (click + in terminal panel):

```powershell
cd frontend
npm install
npm start
```

Browser opens at **http://localhost:3000**

---

### STEP 5 — Use the App

**Landing page** → animated, no forced login
- Click **Get Started** or **Sign Up Free** in sidebar
- Register your account → redirected to Dashboard

**Dashboard** → `/dashboard`
- Click **⚙ Configure Dashboard** → enters edit mode
- Left panel shows Widget Library (Bar, Line, Pie, Area, Scatter, Table, KPI)
- Click a widget type → right panel opens for configuration
- Drag widgets on canvas to rearrange
- Click **Save** → layout saved to MongoDB

**Customer Orders** → `/orders`
- Click **+ Create Order** → popup form
- Auto-generates **CUST-0001** and **ORD-0001** IDs
- All monetary values in ₹ (INR)
- Pagination, search, filter by status

---

### STEP 6 — Verify in MongoDB Compass
After creating orders:
1. Go to Compass → refresh
2. Click `delaxiy` database
3. You will see:
   - `users` — registered accounts
   - `orders` — with CUST/ORD IDs
   - `dashboards` — saved widget layouts

---

## 🔑 .env Files (Already Filled In)

**backend/.env:**
```
MONGO_URI=mongodb://localhost:27017/delaxiy
JWT_SECRET=delaxiy_super_secret_key_2025_priya
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:3000
```

**frontend/.env:**
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 📱 Responsive Breakpoints
| Device | Width | Grid |
|--------|-------|------|
| Desktop | ≥1200px | 12 cols |
| Tablet  | ≥996px  | 8 cols  |
| Small   | ≥768px  | 6 cols  |
| Mobile  | <480px  | 4 cols  |

---

## 🛠 Every Session
```powershell
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm start
```

---

## ❓ Troubleshooting
| Error | Fix |
|-------|-----|
| Cannot find module | `npm install` in that folder |
| Failed to fetch | Backend not running — `npm run dev` |
| Not authorised | Sign in first |
| secretOrPrivateKey | Check backend/.env has JWT_SECRET |
| MongoDB refused | `net start MongoDB` as Administrator |
| Port in use | `npx kill-port 5000` or `npx kill-port 3000` |
