# 🚀 How to Run the Enhanced News App

This guide will help you run the complete Enhanced News App with authentication, voting, and user preferences.

## 📋 Prerequisites

Make sure you have:
- **Node.js** (v16 or higher) installed
- **npm** package manager
- **Internet connection** for NewsAPI and Google OAuth

## 🎯 Quick Start (Recommended)

### Option 1: Run Both Servers with One Command
```bash
# Navigate to the project directory
cd "C:\Users\vansh\OneDrive\Desktop\news-app\news-app"

# Install dependencies (if not already done)
npm install

# Start both frontend and backend servers
npm run dev
```

This will start:
- **Backend Server** on `http://localhost:3002`
- **Frontend React App** on `http://localhost:3000` (or next available port)

## 🔧 Manual Setup (Alternative)

### Option 2: Run Servers Separately

#### Step 1: Start the Backend Server
```bash
# Open Terminal 1
cd "C:\Users\vansh\OneDrive\Desktop\news-app\news-app"

# Start backend server
npm run backend
```

#### Step 2: Start the Frontend Server
```bash
# Open Terminal 2 (new window/tab)
cd "C:\Users\vansh\OneDrive\Desktop\news-app\news-app"

# Start React development server
npm start
```

## 🌐 Access the Application

Once both servers are running:

### 🎨 **Frontend (React App)**
- **URL:** http://localhost:3000 (or http://localhost:3001 if 3000 is busy)
- **Features:** Full news app with authentication UI

### 🔧 **Backend (API Server)**
- **URL:** http://localhost:3002
- **Health Check:** http://localhost:3002/health
- **API Endpoints:**
  - Authentication: `/api/auth`
  - Voting: `/api/voting`
  - Preferences: `/api/preferences`

## 📱 Using the App

### 🔓 **Guest Mode (No Sign-In Required)**
- Browse news articles
- Vote on articles (stored locally)
- Use pagination and filters
- All data saved in browser storage

### 🔐 **Authenticated Mode (Sign In with Google)**
1. Click **"Sign In"** button in the header
2. Sign in with your Google account
3. Enjoy enhanced features:
   - Vote synchronization across devices
   - Persistent user preferences
   - Data backup and recovery

## 🛠️ Available NPM Scripts

```bash
# Frontend only
npm start                    # Start React development server

# Backend only
npm run backend             # Start Express.js backend server
npm run backend:dev         # Start backend with auto-reload (nodemon)

# Both servers
npm run dev                 # Start both frontend and backend servers

# Other
npm run build               # Build React app for production
npm test                    # Run tests
```

## 🔍 Troubleshooting

### Port Conflicts
If you get port conflicts:
- **Frontend:** React will automatically suggest using the next available port
- **Backend:** Currently uses port 3002 (can be changed in `backend/server.js`)

### Dependencies Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Database Issues
The SQLite database is automatically created in:
`backend/database/newsapp.db`

To reset the database, simply delete this file and restart the backend.

## 📁 Project Structure

```
news-app/
├── backend/                 # Express.js backend server
│   ├── database/           # SQLite database and initialization
│   ├── routes/             # API routes (auth, voting, preferences)
│   └── server.js           # Main backend server
├── src/                    # React frontend source
│   ├── components/         # React components
│   ├── contexts/           # React context (AuthContext)
│   ├── services/           # API services
│   └── utils/              # Utility functions
├── public/                 # Static files
└── package.json            # Project dependencies and scripts
```

## 🎉 Features Overview

### 🔐 **Authentication System**
- Google OAuth 2.0 integration
- JWT token management
- Persistent login sessions
- User profile management

### 🗳️ **Voting System**
- Upvote/downvote articles
- Real-time vote counting
- Article ranking by votes
- Vote persistence (local + cloud)

### 📊 **User Preferences**
- Pagination settings
- Filter preferences
- Sort order preferences
- Automatic synchronization

### 📰 **News Features**
- Live NewsAPI.org integration
- Date-based filtering
- Custom date ranges
- Responsive article display
- Article ranking and statistics

## 🆘 Need Help?

If you encounter any issues:
1. Check that both servers are running
2. Verify your internet connection
3. Check browser console for errors
4. Restart both servers
5. Clear browser cache and localStorage

---

**Happy News Reading! 📰✨**