# SoilSync - Smart Agriculture Platform

SoilSync is a full-stack, AI-powered platform for real-time soil analysis, fertilizer recommendations, and farm data management. It combines a modern React dashboard, a Python ML backend, Supabase for authentication and data, and robust SMS/IoT integration to empower farmers and agronomists with actionable insights—online and offline.

---

## 🌟 Features
- **AI-Powered Fertilizer Recommendations** (ML backend, Python, scikit-learn)
- **SMS Service** for instant, offline fertilizer advice (Twilio integration)
- **IoT Sensor Data** simulation and real device support
- **Interactive Dashboard** (React + Vite + Tailwind)
- **Supabase Auth & Database** (Postgres, RLS, Edge Functions)
- **Analytics & Reporting** for farm and model performance
- **Mobile Responsive** and production-ready

---

## 🏗️ Architecture

![SoilSync Architecture](public/Untitled%20diagram%20_%20Mermaid%20Chart-2025-07-01-215637.svg)

---

## 🗂️ Folder Structure

```
Soil-Sync/
├── src/                # React frontend (Vite, TypeScript)
│   ├── components/     # UI components (SMS, IoT, Auth, etc.)
│   ├── services/       # API and business logic
│   └── ...
├── python-ml-server/   # Python Flask ML backend
│   ├── ML_Models/      # Trained model files (.pkl, .joblib)
│   ├── app.py          # Main Flask app
│   └── ...
├── supabase/           # Edge functions, migrations, policies
├── deployment/         # Deployment scripts (Docker, shell)
├── public/             # Static assets
├── README.md           # This file
└── ...
```

---

## ⚙️ Tech Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Python, Flask, scikit-learn, joblib
- **Database:** Supabase (Postgres), RLS, Edge Functions
- **SMS:** Twilio (trial/prod), Supabase Edge Functions
- **IoT:** Simulated and real sensor support
- **Deployment:** Vercel (frontend), Render (backend), Docker

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+
- Python 3.8+
- Docker & Docker Compose
- Supabase account
- Twilio account (for SMS)
- Git

### 2. Clone & Install
```bash
git clone < https://github.com/charite-uwatwembi/Soil-Sync.git >
cd Soil-Sync
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env` and fill in:
```env
# Supabase
VITE_SUPABASE_URL=********************
VITE_SUPABASE_ANON_KEY=**************************
# ML Model
VITE_ML_MODEL_ENDPOINT=https://soil-sync-nq0s.onrender.com/health
# SMS
VITE_TWILIO_ACCOUNT_SID=********************
VITE_TWILIO_AUTH_TOKEN=**********************
VITE_TWILIO_PHONE_NUMBER=+1 856 595 3915
```

### 4. Backend (ML Server)
```bash
cd python-ml-server
pip install -r requirements.txt
# Place your .pkl/.joblib models in ML_Models/
python app.py
```

### 5. Frontend (React)
```bash
cd ../
npm run dev
# Visit http://localhost:5173
```

### 6. Supabase Setup
- Create a project at [supabase.com](https://supabase.com)
- Run SQL migrations in `supabase/migrations/`
- Deploy Edge Functions in `supabase/functions/`

---

## 📱 SMS Service

- **Twilio Number:** +1 856 595 3915
- **Format:**
  ```
  Temp:25,Humidity:60,Moisture:30,Soil_Type:Sandy,Crop_Type:Wheat,N:0.5,P:30,K:20
  ```
- **Allowed Soil_Type:** Sandy, Clay, Loamy
- **Allowed Crop_Type:** Wheat, Rice, Maize
- **All fields required.**
- **Help:** Send `HELP` for instructions.

---

## 🤖 ML Model Integration
- trained `.pkl`/`.joblib` models in `python-ml-server/ML_Models/`
- Model accept features: Temp, Humidity, Moisture, Soil_Type, Crop_Type, N, P, K
- Flask server exposes `/predict` and `/health` endpoints
- See `python-ml-server/app.py` for details

---

## 🌐 IoT Integration
- Simulate sensor data in the dashboard (Soil Data page)
- Real sensors can POST to Supabase Edge Functions
- Data stored in `iot_sensor_data` table

---

## 🗄️ Database Schema (Supabase)
- **Users:** Auth, profile
- **sms_interactions:** Logs all SMS requests/responses
- **iot_sensor_data:** Stores IoT readings
- **ml_predictions:** Stores model predictions
- **news_articles:** Cached agri news
- **user_preferences:** User settings
- **RLS:** Row Level Security enabled on all tables

---

## 🛡️ Security
- Supabase Auth for all users
- RLS on all tables
- API keys for ML endpoints
- SMS rate limiting
- Phone numbers hashed in logs

---

## 💸 Cost Considerations
- Twilio SMS: trial/free, then per-message cost
- Render ML backend: free tier or paid
- Supabase: free tier or paid
- Vercel: free tier or paid

---

## 🛠️ Deployment
- **Frontend:** Vercel (recommended), Netlify, or static hosting
- **Backend:** Render, Docker, or any Python host
- **Supabase:** Managed cloud
- **Edge Functions:** Deploy via Supabase CLI

---

## 🧑‍💻 Contributing
1. Fork the repo
2. Create a feature branch
3. Make changes & test
4. Open a pull request

---

## 🆘 Troubleshooting
- **SMS not working:** Check Twilio credentials, webhook URL, SMS format
- **ML errors:** Check model file, feature order, logs in `python-ml-server/app.py`
- **Supabase issues:** Check API keys, RLS policies, migration status
- **IoT issues:** Check webhook URL, device config

---

## 📞 Support
- Email: support@soilsync.rw
- Phone: +1 856 595 3915
- Hosted Link: [soilsync.rw](https://soil-sync-proj.vercel.app/)

---

**Happy Farming with SoilSync! 🌱🤖**