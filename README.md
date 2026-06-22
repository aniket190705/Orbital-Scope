# 🛰️ OrbitalTracker - Real-time Satellite Tracker with CesiumJS

OrbitalTracker is a full-stack web application that displays real-time satellite positions on a 3D Cesium globe using live TLE (Two-Line Element) data. Track satellites, predict pass times from any location, save favorites, and visualize orbital paths with a beautiful interactive interface.

---

## 🚀 Features

### Core Features
- 🌍 **3D Visualization:** Interactive Cesium globe with satellite positioning
- 📡 **Live Satellite Data:** Real-time orbital position updates using SGP4 propagation via `satellite.js`
- 🎯 **Focus & Track:** Smooth camera movement to follow selected satellites
- 🔁 **Orbital Trails:** 90-minute orbital path visualization around Earth
- 📰 **Space News:** Live articles and updates related to satellite launches and space events

### Advanced Features
- 🔐 **User Authentication:** Sign up, login, and manage your profile with JWT-based auth
- ⭐ **Favorite Satellites:** Save your favorite satellites to your account
- 📍 **Pass Prediction:** Calculate satellite pass times for any Earth location (elevation, azimuth, duration)
- 📊 **Live Information:** Real-time altitude, speed, latitude, longitude updates
- 📋 **Satellite Sidebar:** Select/deselect multiple satellites and view detailed information

---

## ⚙️ Tech Stack

### Frontend
- **React.js** - UI framework
- **Vite** - Build tool and dev server
- **CesiumJS** - 3D geospatial visualization
- **satellite.js** - SGP4 orbit propagation
- **Axios** - HTTP client

### Backend
- **Node.js + Express** - REST API server
- **Prisma ORM** - Database management and migrations
- **PostgreSQL** - Primary database
- **Redis** - Caching and session management
- **JWT** - Authentication & authorization
- **Passport.js** - Authentication strategies

### External APIs
- **Celestrak** - TLE (Two-Line Element) data feeds
- **Spaceflight News API** - Space industry news articles

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy (production)

---

## 📋 Project Structure

```
OrbitalTracker/
├── server/                          # Backend API
│   ├── config/                      # Configuration modules
│   │   ├── env.js                  # Environment variables
│   │   ├── passport.js             # Authentication strategies
│   │   ├── prisma.js               # Prisma client
│   │   └── redis.js                # Redis client
│   ├── controllers/                 # Route handlers
│   │   ├── authController.js       # Auth endpoints
│   │   ├── satelliteController.js  # Satellite endpoints
│   │   └── userController.js       # User endpoints
│   ├── services/                    # Business logic
│   │   ├── passPredictor.js        # Satellite pass prediction
│   │   └── satelliteService.js     # Satellite data management
│   ├── routes/                      # API routes
│   │   ├── authRoutes.js
│   │   ├── satelliteRoutes.js
│   │   └── userRoutes.js
│   ├── middleware/                  # Custom middleware
│   │   ├── authenticateJwt.js      # JWT verification
│   │   ├── errorHandler.js         # Global error handling
│   │   └── validateRequest.js      # Input validation
│   ├── utils/                       # Utility functions
│   │   ├── defaultSatellites.js    # Pre-loaded satellite list
│   │   ├── httpError.js            # Error responses
│   │   ├── jwt.js                  # JWT utilities
│   │   └── validators.js           # Input validators
│   ├── prisma/
│   │   ├── schema.prisma           # Database schema
│   │   └── migrations/             # Database migrations
│   ├── index.js                    # Server entry point
│   ├── package.json
│   └── docker-entrypoint.sh        # Docker startup script
│
├── src/                             # Frontend (React)
│   ├── Components/
│   │   ├── CesiumViewer.jsx        # 3D globe component
│   │   ├── SatelliteTracker.jsx    # Orbit rendering & updates
│   │   ├── SatelliteSidebar.jsx    # Satellite selector
│   │   ├── SatelliteNews.jsx       # News feed
│   │   ├── Login.jsx               # Login page
│   │   ├── Signup.jsx              # Registration page
│   │   ├── Navbar.jsx              # Navigation bar
│   │   ├── Home.jsx                # Landing page
│   │   └── SatelliteViewer.jsx     # Main tracker view
│   ├── context/
│   │   └── AuthContext.jsx         # Authentication state management
│   ├── utils/
│   │   ├── api.js                  # API client
│   │   ├── fetchLiveTLEs.js        # TLE fetching
│   │   └── fetchSpaceNews.js       # News API integration
│   ├── data/
│   │   └── satellites.js           # Static satellite data
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── public/                          # Static assets
│   └── cesium/                      # CesiumJS library
│
├── docker-compose.yml               # Multi-container setup
├── Dockerfile.backend
├── Dockerfile.frontend
├── docker/nginx/default.conf        # Nginx configuration
├── vite.config.js
├── eslint.config.js
├── package.json                     # Root dependencies
└── README.md
```

---

## 🔧 Installation & Setup

### Prerequisites
- **Node.js** v16+ and npm
- **PostgreSQL** 12+
- **Redis** 6+
- **Docker & Docker Compose** (optional, for containerized setup)

### Option 1: Local Development Setup

#### Backend Setup
```bash
cd server

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/orbitaltracker

# Redis
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRY=24h

# External APIs
CELESTRAK_BASE_URL=https://celestrak.org/NORAD/elements/gp.php

# Port
PORT=3000

# Environment
NODE_ENV=development
EOF

# Run database migrations
npx prisma migrate dev --name init

# Start the server
npm start
# Server runs on http://localhost:3000
```

#### Frontend Setup
```bash
# From project root
cd .

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_CESIUM_API_KEY=your_cesium_ion_token_here
VITE_API_BASE_URL=http://localhost:3000/api
EOF

# Get your Cesium Ion token: https://cesium.com/ion

# Start dev server
npm run dev
# App runs on http://localhost:5173
```

### Option 2: Docker Compose Setup

```bash
# Create .env file in project root
cat > .env << EOF
DATABASE_URL=postgresql://orbitaluser:orbitalpass@db:5432/orbitaltracker
REDIS_URL=redis://redis:6379
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRY=24h
CELESTRAK_BASE_URL=https://celestrak.org/NORAD/elements/gp.php
PORT=3000
NODE_ENV=development
VITE_CESIUM_API_KEY=your_cesium_ion_token_here
VITE_API_BASE_URL=http://localhost/api
EOF

# Start all services
docker-compose up -d

# Run migrations
docker-compose exec api npm run migrate

# App runs on http://localhost
```

---

## 🌐 Environment Variables

### Backend (`server/.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost/db` |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `your-secret-key-here` |
| `JWT_EXPIRY` | JWT expiration time | `24h` |
| `CELESTRAK_BASE_URL` | Celestrak API endpoint | `https://celestrak.org/NORAD/elements/gp.php` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `REDIS_TTL_SECONDS` | Cache TTL for TLE data | `3600` |

### Frontend (`.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_CESIUM_API_KEY` | Cesium Ion API key | `your-token-from-cesium` |
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000/api` |

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/logout` - Logout

### Satellites
- `GET /api/satellites` - Get default satellites
- `GET /api/satellites/:id` - Get satellite by NORAD ID
- `GET /api/satellites/:id/passes` - Predict pass times
  - Query: `lat`, `lng`, `altitudeKm` (optional)
- `POST /api/satellites/custom` - Add custom satellite via TLE

### Users
- `GET /api/users/profile` - Get user profile (auth required)
- `POST /api/users/favorites` - Save favorite satellite (auth required)
- `DELETE /api/users/favorites/:id` - Remove from favorites (auth required)
- `GET /api/users/favorites` - Get user's favorite satellites (auth required)

---

## 🎯 Usage

### Tracking Satellites
1. **Select satellites** from the sidebar (left panel)
2. **View real-time data**: altitude, speed, latitude, longitude
3. **Click "Focus on Satellite"** to center the camera
4. **Hover over satellites** to see orbital trails (90-minute history)

### Predicting Passes
1. Select a satellite and your location (latitude, longitude, altitude)
2. The API calculates visible passes for the next 24 hours
3. View elevation angle, azimuth, start/end times, and duration

### Saving Favorites
1. **Sign up/Login** to your account
2. **Click the star icon** next to a satellite to save it
3. Favorites sync across sessions

---

## 🚀 Deployment

### Using Docker
```bash
# Build and run production containers
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up -d
```

### Manual Deployment (e.g., Vercel + Render)
- Frontend: Deploy `dist/` folder to Vercel
- Backend: Deploy to Render or similar Node.js hosting
- Database: Use managed PostgreSQL service
- Update environment variables in hosting platform

---

## 📚 Development Guide

### Database Migrations
```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# View database
npx prisma studio
```

### Adding New Satellites
Update `server/utils/defaultSatellites.js` with NORAD IDs:
```javascript
export const DEFAULT_SATELLITE_IDS = [25544, 33591, ...];
```

### Linting & Formatting
```bash
npm run lint
npm run format
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| TLE data not updating | Check Redis connection and CELESTRAK_BASE_URL |
| Satellites not visible | Verify Cesium API key and globe initialization |
| Pass prediction errors | Ensure observer coordinates are valid (lat: ±90, lng: ±180) |
| Authentication fails | Check JWT_SECRET matches across services |
| Docker issues | Run `docker-compose logs` to debug container startup |

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss proposed changes.

---

## 📞 Support

For issues, questions, or suggestions, please open a GitHub issue or contact the maintainers.


