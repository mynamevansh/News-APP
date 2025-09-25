# 🚀 Simple Guide: How to Run Your Enhanced News App

## ✅ Method 1: Manual Start (Recommended)

### Step 1: Start the Backend Server
Open **Terminal 1** (PowerShell) and run:
```powershell
cd "C:\Users\vansh\OneDrive\Desktop\news-app\news-app"
npm run backend
```

You should see:
```
✅ Database initialized successfully
🚀 News App Backend running on http://localhost:3002
```

### Step 2: Start the Frontend Server
Open **Terminal 2** (new PowerShell window) and run:
```powershell
cd "C:\Users\vansh\OneDrive\Desktop\news-app\news-app"
npm start
```

If prompted about port conflicts, choose **Y** to use a different port.

### Step 3: Access Your App
- **Main App:** http://localhost:3000 (or the port React suggests)
- **Backend API:** http://localhost:3002

## 🎯 Method 2: One Command (Alternative)

If you want to start both with one command:
```powershell
cd "C:\Users\vansh\OneDrive\Desktop\news-app\news-app"
npm run dev
```

## 🔧 Available Commands

```powershell
# Start only frontend
npm start

# Start only backend
npm run backend

# Start both (if working)
npm run dev

# Start backend with auto-reload
npm run backend:dev
```

## 🌟 What You'll See

### Backend Console Output:
```
Starting News App Backend Server...
✅ Database initialized successfully
🚀 News App Backend running on http://localhost:3002
📊 Health check: http://localhost:3002/health
🔐 Auth endpoint: http://localhost:3002/api/auth
🗳️  Voting endpoint: http://localhost:3002/api/voting
⚙️  Preferences endpoint: http://localhost:3002/api/preferences
```

### Frontend (Browser):
- Beautiful news interface
- Google Sign-In button
- Voting buttons on articles
- Pagination controls
- Date filter options

## 🛠️ Troubleshooting

### Port Conflicts
If React says "Something is already running on port 3002":
- Choose **Y** when prompted to use another port
- React will automatically use port 3000, 3001, etc.

### Backend Not Starting
Make sure you're in the right directory:
```powershell
Get-Location  # Should show: C:\Users\vansh\OneDrive\Desktop\news-app\news-app
```

### Frontend Errors
If you see compilation errors, they're likely just warnings and the app should still work.

## 🎉 Success!
When both servers are running, you'll have:
- ✅ Live news feed
- ✅ Google authentication
- ✅ Voting system
- ✅ User preferences
- ✅ Database storage
- ✅ Beautiful UI

---

**Need help? Both servers should be running simultaneously in separate terminals!**