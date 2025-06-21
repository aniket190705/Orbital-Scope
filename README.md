# 🛰️ OrbitalScope - Real-time Satellite Tracker with CesiumJS

OrbitalScope is an interactive web application that displays real-time satellite positions on a 3D Cesium globe using live TLE data. It also shows the satellite's altitude, speed, latitude, longitude, and visual trail path.

## 🚀 Features

- 🌍 3D visualization of satellites in orbit using CesiumJS
- 📡 Live satellite data using `satellite.js` and TLE updates from Celestrak
- 🎯 Focus and track satellites with smooth camera movement
- 📈 Real-time updates of:
  - Altitude
  - Speed
  - Latitude & Longitude
- 🔁 Satellite orbital trail visualization (past 90 mins)
- 📰 News section with live articles related to satellite launches
- 📋 Sidebar to select/deselect satellites and view details

---

## ⚙️ Tech Stack

- 🖥️ **Frontend:** React.js, Vite
- 🌌 **3D Engine:** CesiumJS
- 📦 **Satellite Data:** `satellite.js`, Celestrak TLE feeds
- 📰 **News API:** Spaceflight News

---

## 🔧 Installation & Setup

1. **Clone the repository**
- git clone https://github.com/your-username/orbitalscope.git
- cd orbitalscope

2. **Install Dependencies**
npm install

4. Add Your Cesium API Key
- Create a .env file in the root directory:
- VITE_CESIUM_API_KEY=your_cesium_ion_token_here
- Get your token from: https://cesium.com/ion

4. Run the App
- npm run dev
- The app will be available at http://localhost:5173 (or similar).



