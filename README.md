# Hashim Automotive Luxury

A world-class luxury automotive marketplace and showroom platform.

## Design System & Features
- **Premium Glassmorphic Theme**: Dark/light theme utilizing HSL tailored colors.
- **3D Vehicle Configurator**: Interactive 3D controls to open doors, hood, trunk, steer, rotate wheels, change body color paint, and adjust studio lighting presets using React Three Fiber.
- **AI Recommendation Concierge**: Diagnostic survey matching client specifications against vehicle parameters.
- **Bespoke Comparison Matrix**: Compare up to 4 models with radar and pricing charts, and export data as PDF.
- **EV Hub**: Charging cost savings calculator and range autonomy simulator.
- **Car Reels**: Tiktok-style vertical looping video feed with comments drawer.
- **VIP Scheduler**: Reservation calendar blocking Sundays and generating PDF confirmation tickets.
- **Admin Dashboard**: Visual metric trends with charts and full catalog CRUD capabilities.

---

## Technical Stack
- **Frontend**: React.js, Tailwind CSS, Framer Motion, Three.js, React Three Fiber, Recharts, jsPDF.
- **Backend**: Node.js, Express.js, JWT Authentication.
- **Database**: Dual-mode storage (MongoDB with automatic local memory/JSON fallback).

---

## Setup & Running the Application

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed.

### 2. Install Dependencies
At the root directory, run:
```bash
npm install --legacy-peer-deps
```

### 3. Run Backend Server
From the root directory:
```bash
npm run start:server
```
The server will start on `http://localhost:5000`. It will attempt connection to MongoDB (if configured via environment variables) and automatically fall back to an in-memory database with pre-populated seed data.

### 4. Run Frontend Client
*Note: Since the local directory path (`Buy & Sell`) contains an ampersand (`&`), Windows `cmd.exe` fails to run script binaries in `.bin` directories due to shell syntax rules. Run the hoisted Vite binary directly via Node to bypass this:*

From the **client** directory:
```bash
node "../node_modules/vite/bin/vite.js"
```
The client dev server will start on `http://localhost:5173`.

---

## Demo Accounts
- **Admin**: `admin@hashimcars.com` / `admin123`
- **Client**: `user@hashimcars.com` / `user123`
