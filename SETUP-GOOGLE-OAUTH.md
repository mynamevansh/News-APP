# 🔐 Complete Google OAuth Setup Guide

## 🎯 Quick Setup Steps

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. **Project name:** "News App OAuth"
4. Click **"Create"**

### Step 2: Enable APIs
1. In the left sidebar, go to **"APIs & Services"** → **"Library"**
2. Search and enable these APIs:
   - **"Google+ API"** (click Enable)
   - **"Identity Toolkit API"** (click Enable)

### Step 3: Configure OAuth Consent Screen
1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Choose **"External"** → Click **"Create"**
3. Fill in required fields:
   - **App name:** News App
   - **User support email:** your-email@gmail.com
   - **App logo:** (optional)
   - **App domain:** (leave blank for development)
   - **Developer contact email:** your-email@gmail.com
4. Click **"Save and Continue"**
5. **Scopes:** Click **"Save and Continue"** (use defaults)
6. **Test users:** Add your email address
7. Click **"Save and Continue"**

### Step 4: Create OAuth Credentials
1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ Create Credentials"** → **"OAuth 2.0 Client IDs"**
3. **Application type:** Web application
4. **Name:** News App Web Client
5. **Authorized JavaScript origins:**
   ```
   http://localhost:3000
   http://localhost:3001
   ```
6. **Authorized redirect URIs:**
   ```
   http://localhost:3000
   http://localhost:3001
   ```
7. Click **"Create"**

### Step 5: Copy Your Credentials
After creation, you'll see a dialog with:
- **Client ID:** (something like: 123456789-abc...xyz.apps.googleusercontent.com)
- **Client Secret:** (something like: GOCSPX-abc...xyz)

**Keep this dialog open - you'll need these values!**

### Step 6: Update Your .env File
Replace the placeholder values in your .env file with the real credentials you just created.

## 🔧 Next: Update Environment Variables

After completing the Google Cloud setup above, run this command to update your .env file:

```powershell
# Navigate to your project
cd "C:\Users\vansh\OneDrive\Desktop\news-app\news-app"

# Edit the .env file with your real credentials
notepad .env
```

Replace these lines with your actual values:
```env
GOOGLE_CLIENT_ID=your_actual_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
REACT_APP_GOOGLE_CLIENT_ID=your_actual_client_id_here
```

## ⚠️ Important Security Notes:
- Never share your Client Secret publicly
- The .env file is already in .gitignore
- These credentials only work for localhost during development
- For production, you'll need to add your production domain

## 🎉 After Setup:
1. Restart your backend server
2. Refresh your frontend
3. The Google Sign-In button should work!

---

**Need help? Follow each step carefully and the authentication will work perfectly!**