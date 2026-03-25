# 🌍 Resilient City

A full-stack climate resilience and environmental awareness platform for Delhi, India.


## ✨ Features

- **3D Earth Hero** — Interactive Three.js globe with scroll-based animations
- **Live Dashboard** — Real-time AQI data for 8 Delhi areas 
- **Climate Risk Sections** — Detailed pages on heatwaves, air pollution, flooding, and environmental issues
- **Interactive Map** — Leaflet map with AQI hotspots, flood zones, and user reports
- **Community Reporting** — Submit environmental incident reports
- **Real-time Alerts** — Socket.IO-powered live alert system
- **AI Chatbot** — Climate-focused chatbot for quick information
- **JWT Authentication** — Secure signup/login system

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS (dark theme)
- Framer Motion (animations)
- React Three Fiber (3D Earth)
- React Leaflet (maps)
- Socket.IO Client

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT + bcrypt (auth)
- Socket.IO (real-time)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (optional — app works with mock data)

### Installation

```bash
# Clone the repo
git clone <your-repo-url>
cd environment

# Install backend dependencies
cd server
npm install
cp .env.example .env  # Edit with your MongoDB URI

# Install frontend dependencies
cd ../client
npm install
```

### Running Locally

```bash
# Terminal 1 — Start backend
cd server
npm start
# Server runs on http://localhost:5000

# Terminal 2 — Start frontend
cd client
npm run dev
# App runs on http://localhost:5173
```

### Environment Variables

Create `server/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resilient-city
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

## 📁 Project Structure

```
environment/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   │   ├── hero/       # 3D Earth & hero section
│   │   │   ├── dashboard/  # AQI & weather cards
│   │   │   ├── climate/    # Climate risk cards
│   │   │   ├── map/        # Leaflet map
│   │   │   ├── alerts/     # Alert banner
│   │   │   ├── community/  # Report form
│   │   │   ├── chatbot/    # AI chatbot
│   │   │   └── layout/     # Navbar & footer
│   │   ├── pages/          # Route pages
│   │   ├── hooks/          # Custom hooks
│   │   └── services/       # API service
│   └── package.json
├── server/                 # Express backend
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── middleware/          # Auth middleware
│   ├── config/             # DB config
│   └── server.js
└── README.md
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/aqi | AQI data for Delhi areas |
| GET | /api/weather | Delhi weather data |
| GET | /api/alerts | Active climate alerts |
| POST | /api/alerts | Create new alert |
| GET | /api/reports | Community reports |
| POST | /api/reports | Submit a report |
| POST | /api/auth/signup | User registration |
| POST | /api/auth/login | User login |

## ☁️ Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy the dist/ folder to Vercel
```

### Backend (Render/Railway)
- Set environment variables in the dashboard
- Deploy the `server/` directory
- Update `CLIENT_URL` to your Vercel domain

