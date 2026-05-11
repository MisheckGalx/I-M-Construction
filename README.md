# I&M Construction — Full-Stack Website

**Royal Blue · Corporate & Trustworthy**  
Built with: Vanilla HTML/CSS/JS + Node.js + Express + MongoDB + Nodemailer

---

## 📁 PROJECT STRUCTURE

```
isiah-fullstack/
│
├── isiah-construction/          ← Frontend (static site)
│   ├── index.html               ← Main HTML entry point
│   ├── css/
│   │   ├── tokens.css           ← Design tokens (colors, fonts, spacing)
│   │   ├── reset.css            ← CSS reset
│   │   ├── base.css             ← Global styles, shared buttons
│   │   ├── loader.css           ← Page loader
│   │   ├── nav.css              ← Navigation + mobile menu
│   │   ├── hero.css             ← Hero section + slideshow
│   │   ├── about.css            ← About section + photo collage
│   │   ├── services.css         ← Services grid + cards
│   │   ├── projects.css         ← Projects masonry + lightbox
│   │   ├── why.css              ← Why Choose Us section
│   │   ├── process.css          ← Process steps
│   │   ├── testimonials.css     ← Testimonials carousel
│   │   ├── contact.css          ← Contact form + validation UI
│   │   ├── footer.css           ← Footer
│   │   ├── animations.css       ← Scroll reveals + keyframes
│   │   └── responsive.css       ← Mobile breakpoints
│   └── js/
│       ├── utils.js             ← Shared helpers ($, $$, debounce)
│       ├── loader.js            ← Animated page loader
│       ├── nav.js               ← Sticky nav + mobile menu
│       ├── hero.js              ← Slideshow + particles + parallax
│       ├── reveal.js            ← IntersectionObserver scroll reveals
│       ├── counters.js          ← Animated stat counters
│       ├── testimonials.js      ← Carousel + autoplay + swipe
│       ├── projects.js          ← Filter + lightbox
│       ├── form.js              ← API form submission + validation
│       └── interactions.js      ← Custom cursor + tilt + magnetic
│
└── isiah-backend/               ← Backend (Node.js API)
    ├── server.js                ← Express app entry point
    ├── package.json             ← Dependencies
    ├── .env                     ← Your secrets (never commit!)
    ├── .env.example             ← Template for .env
    ├── .gitignore
    ├── config/
    │   ├── db.js                ← MongoDB connection
    │   ├── email.js             ← Nodemailer transporter
    │   └── constants.js         ← Services list, status enums, company info
    ├── models/
    │   ├── Enquiry.js           ← Contact form submissions
    │   └── Admin.js             ← Admin users (with password hashing)
    ├── controllers/
    │   ├── contactController.js ← POST /api/contact logic
    │   └── adminController.js   ← Admin CRUD + stats + auth
    ├── routes/
    │   ├── contact.js           ← POST /api/contact
    │   └── admin.js             ← /api/admin/* (protected)
    ├── middleware/
    │   ├── auth.js              ← JWT protect middleware
    │   ├── validate.js          ← express-validator rules
    │   ├── rateLimiter.js       ← Rate limiting (5 form submits / 15 min)
    │   └── errorHandler.js      ← Global error handler + AppError class
    ├── services/
    │   └── emailService.js      ← Sends owner + client emails
    ├── emails/
    │   ├── ownerTemplate.js     ← Email to Isiah on new enquiry
    │   └── clientTemplate.js    ← Auto-reply to the client
    └── utils/
        ├── seedAdmin.js         ← Create first admin account (run once)
        └── testEmail.js         ← Test SMTP setup

```

---

## 🚀 LOCAL SETUP — STEP BY STEP

### Prerequisites
- Node.js v18+ → https://nodejs.org
- MongoDB Atlas account (free) → https://cloud.mongodb.com
- VS Code + Live Server extension (for frontend)

---

### STEP 1 — Backend Setup

```bash
cd isiah-backend
npm install
```

### STEP 2 — Configure .env

Open `isiah-backend/.env` and fill in:

| Variable | Value |
|---|---|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `EMAIL_USER` | Isaiahmudhluli@gmail.com |
| `EMAIL_PASS` | Your 16-char Gmail App Password |
| `JWT_SECRET` | Any long random string |

**Get Gmail App Password:**
1. Go to myaccount.google.com
2. Security → Enable 2-Step Verification
3. Security → App passwords → Select "Mail" → "Other"
4. Name it "Isiah Construction" → Copy the 16-char password

**Get MongoDB URI:**
1. Sign up at cloud.mongodb.com (free)
2. Create a cluster → Connect → "Connect your application"
3. Copy the URI, replace `<password>` with your DB password

### STEP 3 — Seed Admin Account

```bash
cd isiah-backend
node utils/seedAdmin.js
```

### STEP 4 — Test Email

```bash
node utils/testEmail.js
```
Check your inbox at Isaiahmudhluli@gmail.com for a test email.

### STEP 5 — Start Backend

```bash
npm run dev        # development (auto-restarts on save)
# or
npm start          # production
```

Backend runs at: **http://localhost:5000**

Health check: http://localhost:5000/health

### STEP 6 — Start Frontend

**Option A: VS Code Live Server**
- Open `isiah-construction/index.html` in VS Code
- Right-click → "Open with Live Server"
- Opens at: http://127.0.0.1:5500

**Option B: Python (no install needed)**
```bash
cd isiah-construction
python3 -m http.server 3000
# Opens at http://localhost:3000
```

**Option C: npx serve**
```bash
cd isiah-construction
npx serve .
```

---

## 🔌 API ENDPOINTS

### Public

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/contact` | Submit contact form |
| GET | `/health` | Server health check |

### Admin (requires Bearer JWT token)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/admin/login` | Get JWT token |
| GET | `/api/admin/me` | Current admin info |
| GET | `/api/admin/stats` | Dashboard stats |
| GET | `/api/admin/enquiries` | All enquiries (paginated) |
| GET | `/api/admin/enquiries/:id` | Single enquiry |
| PATCH | `/api/admin/enquiries/:id/status` | Update status |
| DELETE | `/api/admin/enquiries/:id` | Delete (superadmin only) |

---

## 🧪 TEST THE FORM

With both servers running:
1. Open the frontend in your browser
2. Fill in the contact form
3. Click "Send Message"
4. Check Isaiahmudhluli@gmail.com for:
   - 🔔 Owner notification email
   - ✅ Client auto-reply email

---

## ⚡ QUICK COMMANDS

```bash
# Backend dev server
cd isiah-backend && npm run dev

# Test email setup
cd isiah-backend && node utils/testEmail.js

# Create admin user
cd isiah-backend && node utils/seedAdmin.js

# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🚢 DEPLOY (When Ready)

**Backend:** Railway / Render / Heroku  
**Frontend:** Netlify / Vercel / GitHub Pages  
**Database:** MongoDB Atlas (already cloud)

Change in `js/form.js`:
```js
const API_URL = 'https://your-backend.railway.app/api/contact';
```

---

*I&M Construction Company — Building Your Dreams, One Project at a Time*
