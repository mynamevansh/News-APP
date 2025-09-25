# Google OAuth Setup Guide

## Steps to Configure Google OAuth:

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Name it something like "News App Authentication"

### 2. Enable Google+ API
1. In the Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google+ API" and enable it
3. Also enable "Google Identity" API if available

### 3. Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Configure OAuth consent screen first if prompted:
   - User Type: External
   - App name: News App
   - User support email: your email
   - Developer contact: your email
4. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Name: News App Web Client
   - Authorized JavaScript origins: 
     - http://localhost:3000
     - http://localhost:3001
   - Authorized redirect URIs:
     - http://localhost:3001/auth/google/callback
     - http://localhost:3000/auth/callback

### 4. Get Credentials
1. After creation, copy the Client ID and Client Secret
2. Update your .env file:
   ```
   GOOGLE_CLIENT_ID=your_actual_client_id_here
   GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
   ```

### 5. Configure Test Users (Development)
1. In OAuth consent screen, add test users if in testing mode
2. Add your email address as a test user

### 6. Generate JWT Secret
Run this command to generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Copy the output and update JWT_SECRET in your .env file.

## Environment Variables Template:
```env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
JWT_SECRET=your_64_character_random_string_here
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
DB_PATH=./backend/database/newsapp.db
SESSION_DURATION_HOURS=168
```

## Important Notes:
- Keep your Client Secret secure and never commit it to version control
- The .env file is already in .gitignore to prevent accidental commits
- For production, use environment variables on your hosting platform
- Update authorized origins and redirect URIs for production deployment