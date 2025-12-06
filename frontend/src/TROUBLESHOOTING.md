# Troubleshooting Guide

This guide covers common issues and their solutions for the Incident Reporting Application.

## Table of Contents
1. [Frontend Issues](#frontend-issues)
2. [Backend Issues](#backend-issues)
3. [Database Issues](#database-issues)
4. [Email Issues](#email-issues)
5. [File Upload Issues](#file-upload-issues)

---

## Frontend Issues

### ❌ Error: "Cannot read properties of undefined (reading 'VITE_API_URL')"

**Cause:** Missing or incorrectly configured `.env` file

**Solution:**
1. Ensure `.env` file exists in the root directory (same level as `package.json`)
2. Verify it contains:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_GOOGLE_MAPS_API_KEY=YOUR_KEY_HERE
   ```
3. **Important:** Restart the Vite development server after creating/modifying `.env`:
   ```bash
   # Press Ctrl+C to stop the server
   npm run dev
   ```
4. Environment variables must start with `VITE_` prefix to be accessible in the frontend

---

### ❌ Error: "Network Error" or "Failed to fetch"

**Cause:** Backend server is not running or CORS issues

**Solution:**
1. Verify backend is running:
   ```bash
   cd backend
   npm start
   ```
2. Check backend is accessible at `http://localhost:5000/api/health`
3. Ensure `FRONTEND_URL` in `backend/.env` matches your frontend URL
4. Check browser console for specific CORS errors

---

### ❌ Google Maps not loading

**Cause:** Missing or invalid Google Maps API key

**Solution:**
1. Get a Google Maps API key from: https://console.cloud.google.com/
2. Enable required APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
3. Add to `.env`:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_actual_key_here
   ```
4. Restart development server
5. For development, allow `http://localhost:5173` in API key restrictions

---

## Backend Issues

### ❌ Error: "PORT is not defined" or similar

**Cause:** Missing `backend/.env` file

**Solution:**
1. Navigate to backend directory:
   ```bash
   cd backend
   ```
2. Copy example environment file:
   ```bash
   cp .env.example .env
   ```
3. Edit `backend/.env` with your configuration
4. Restart backend server

---

### ❌ Backend won't start or crashes immediately

**Cause:** Missing dependencies or configuration errors

**Solution:**
1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Check all required environment variables are set in `backend/.env`
3. Verify MySQL is running
4. Check logs for specific error messages

---

### ❌ Error: "listen EADDRINUSE: address already in use"

**Cause:** Port 5000 is already in use

**Solution:**
1. Find and kill the process using port 5000:
   ```bash
   # On macOS/Linux:
   lsof -ti:5000 | xargs kill -9
   
   # On Windows:
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```
2. Or change the port in `backend/.env`:
   ```env
   PORT=5001
   ```
3. Update frontend `.env` accordingly:
   ```env
   VITE_API_URL=http://localhost:5001
   ```

---

## Database Issues

### ❌ Error: "Access denied for user 'root'@'localhost'"

**Cause:** Incorrect MySQL credentials

**Solution:**
1. Update `backend/.env` with correct credentials:
   ```env
   DB_USER=root
   DB_PASSWORD=your_actual_mysql_password
   ```
2. Test MySQL connection:
   ```bash
   mysql -u root -p
   ```
3. If password is forgotten, reset it following MySQL documentation

---

### ❌ Error: "Unknown database 'incident_reporting'"

**Cause:** Database hasn't been created

**Solution:**
1. Connect to MySQL:
   ```bash
   mysql -u root -p
   ```
2. Create the database:
   ```sql
   CREATE DATABASE incident_reporting;
   SHOW DATABASES;
   exit;
   ```
3. The backend will automatically create tables on first run

---

### ❌ Error: "ER_NOT_SUPPORTED_AUTH_MODE"

**Cause:** MySQL 8.0 authentication compatibility issue

**Solution:**
1. Connect to MySQL:
   ```bash
   mysql -u root -p
   ```
2. Update authentication:
   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
   FLUSH PRIVILEGES;
   exit;
   ```
3. Restart backend server

---

### ❌ Tables not being created automatically

**Cause:** Database connection or model sync issues

**Solution:**
1. Check database connection in backend logs
2. Verify `force: false` in `backend/models/index.js` is set correctly
3. Manually check if tables exist:
   ```sql
   USE incident_reporting;
   SHOW TABLES;
   ```
4. If needed, drop and recreate database:
   ```sql
   DROP DATABASE incident_reporting;
   CREATE DATABASE incident_reporting;
   ```

---

## Email Issues

### ❌ Email notifications not being sent

**Cause:** Incorrect email configuration

**Solution for Gmail:**
1. Enable 2-factor authentication on your Google account
2. Create an App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Generate new app password
   - Copy the 16-character password
3. Update `backend/.env`:
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your.email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   EMAIL_FROM=your.email@gmail.com
   ```
4. Restart backend server

**Solution for Other Email Providers:**
1. Check provider's SMTP settings
2. Update `EMAIL_SERVICE` or use custom SMTP configuration
3. Ensure "Allow less secure apps" is enabled if required

---

### ❌ Emails going to spam

**Cause:** Email configuration or content triggers spam filters

**Solution:**
1. Check spam folder
2. Add sender to safe senders list
3. For production, use a verified domain
4. Consider using a dedicated email service (SendGrid, AWS SES, etc.)

---

## File Upload Issues

### ❌ Error: "Failed to upload file" or "File too large"

**Cause:** File size exceeds limit or uploads directory doesn't exist

**Solution:**
1. Check `MAX_FILE_SIZE` in `backend/.env` (default: 10MB in bytes)
   ```env
   MAX_FILE_SIZE=10485760
   ```
2. Ensure `backend/uploads` directory exists:
   ```bash
   cd backend
   mkdir -p uploads
   chmod 755 uploads
   ```
3. Verify directory permissions allow write access

---

### ❌ Uploaded images not displaying

**Cause:** Incorrect file paths or CORS issues

**Solution:**
1. Verify files are in `backend/uploads` directory
2. Check `BASE_URL` in `backend/.env`:
   ```env
   BASE_URL=http://localhost:5000
   ```
3. Ensure static file serving is configured in `backend/server.js`
4. Test file access directly: `http://localhost:5000/uploads/filename.jpg`

---

### ❌ Error: "Multer unexpected field"

**Cause:** Form field name mismatch

**Solution:**
1. Ensure frontend sends files with correct field names
2. Backend expects field name: `media` (can be array)
3. Check `backend/middleware/upload.middleware.js` configuration

---

## General Debugging Tips

### Enable Verbose Logging

**Frontend:**
- Open browser Developer Tools (F12)
- Check Console tab for errors
- Check Network tab for API requests

**Backend:**
- Check terminal for error logs
- Add console.log statements for debugging
- Use `NODE_ENV=development` for detailed errors

### Clear Cache and Restart

Sometimes issues are caused by cached data:

```bash
# Frontend
rm -rf node_modules
npm install
npm run dev

# Backend
cd backend
rm -rf node_modules
npm install
npm start
```

### Check Versions

Ensure you're using compatible versions:
- Node.js: v14 or higher
- MySQL: v5.7 or v8.0
- npm: v6 or higher

```bash
node --version
mysql --version
npm --version
```

---

## Still Having Issues?

1. **Check all environment variables** in both `.env` files
2. **Restart both servers** completely
3. **Check firewall settings** - ensure ports 5000 and 5173 are not blocked
4. **Review error logs** carefully - they often contain specific solutions
5. **Test each component separately**:
   - Can you connect to MySQL directly?
   - Does the backend health check work?
   - Can you sign up/login?
   - Can you create incidents?

---

## Quick Checklist

Before asking for help, verify:

- [ ] `.env` exists in root directory
- [ ] `backend/.env` exists with correct values
- [ ] MySQL is running
- [ ] Database `incident_reporting` exists
- [ ] Backend server is running on port 5000
- [ ] Frontend server is running on port 5173
- [ ] Both servers restarted after environment changes
- [ ] No firewall blocking ports
- [ ] Dependencies installed (`npm install` in both directories)
- [ ] Node.js and MySQL versions are compatible

---

## Development Workflow

Recommended startup sequence:

```bash
# Terminal 1 - Backend
cd backend
npm install          # First time only
mysql -u root -p     # Create database if needed
npm start            # or npm run dev for auto-restart

# Terminal 2 - Frontend
npm install          # First time only
npm run dev

# Open browser to http://localhost:5173
```

---

For more information, see:
- [Environment Setup Guide](./ENVIRONMENT_SETUP.md)
- [Backend README](./backend/README.md)
- [Backend Integration Guide](./BACKEND_INTEGRATION_GUIDE.md)
