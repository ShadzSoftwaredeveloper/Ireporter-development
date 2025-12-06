# Environment Setup Guide

This guide will help you set up the environment variables for both the frontend and backend of the incident reporting application.

## Frontend Environment Setup

### 1. Copy the Example Environment File

```bash
cp .env.example .env
```

### 2. Configure Environment Variables

Open the `.env` file and update the following variables:

```env
# API Configuration
VITE_API_URL=http://localhost:5000

# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY_HERE
```

#### Environment Variables Explained:

- **VITE_API_URL**: The URL where your backend server is running
  - Default: `http://localhost:5000`
  - For production, update this to your production API URL

- **VITE_GOOGLE_MAPS_API_KEY**: Your Google Maps JavaScript API key
  - Get your key at: https://developers.google.com/maps/documentation/javascript/get-api-key
  - Enable the following APIs in Google Cloud Console:
    - Maps JavaScript API
    - Places API
    - Geocoding API

### 3. Install Frontend Dependencies

```bash
npm install
```

### 4. Start the Frontend Development Server

```bash
npm run dev
```

The frontend should now be running at `http://localhost:5173` (or another port if 5173 is in use).

---

## Backend Environment Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Copy the Example Environment File

```bash
cp .env.example .env
```

### 3. Configure Backend Environment Variables

Open `backend/.env` and update the following:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=incident_reporting
DB_PORT=3306

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (for notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=your-email@gmail.com

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads
```

#### Backend Environment Variables Explained:

**Server Configuration:**
- **PORT**: The port your backend server will run on (default: 5000)
- **NODE_ENV**: Environment mode (development/production)

**Database Configuration:**
- **DB_HOST**: MySQL host (default: localhost)
- **DB_USER**: MySQL username
- **DB_PASSWORD**: Your MySQL password
- **DB_NAME**: Database name (default: incident_reporting)
- **DB_PORT**: MySQL port (default: 3306)

**JWT Configuration:**
- **JWT_SECRET**: Secret key for JWT token generation (change this to a random string)

**Email Configuration:**
- **EMAIL_SERVICE**: Email service provider (gmail, outlook, etc.)
- **EMAIL_USER**: Your email address
- **EMAIL_PASSWORD**: 
  - For Gmail: Create an App Password at https://myaccount.google.com/apppasswords
  - For other providers: Use your email password or app-specific password
- **EMAIL_FROM**: Email address to send from (usually same as EMAIL_USER)

**Other Configuration:**
- **FRONTEND_URL**: URL of your frontend app (for CORS)
- **MAX_FILE_SIZE**: Maximum file upload size in bytes (default: 10MB)
- **UPLOAD_DIR**: Directory for uploaded files (default: uploads)

### 4. Install Backend Dependencies

```bash
npm install
```

### 5. Set Up MySQL Database

Make sure MySQL is installed and running on your system. Then create the database:

```bash
mysql -u root -p
```

```sql
CREATE DATABASE incident_reporting;
exit;
```

### 6. Start the Backend Server

```bash
npm start
```

Or for development with auto-restart:

```bash
npm run dev
```

The backend should now be running at `http://localhost:5000`.

---

## Verification

### Check Backend Connection

Visit `http://localhost:5000/api/health` in your browser. You should see a health check response.

### Check Frontend Connection

1. Start both frontend and backend servers
2. Navigate to `http://localhost:5173`
3. Try signing up for a new account
4. If successful, you'll receive a success message

---

## Common Issues

### Issue: "Cannot read properties of undefined (reading 'VITE_API_URL')"

**Solution:** 
- Ensure `.env` file exists in the root directory
- Restart the Vite development server after creating/modifying `.env`
- Verify variable names start with `VITE_` prefix

### Issue: "Database connection failed"

**Solution:**
- Verify MySQL is running
- Check database credentials in `backend/.env`
- Ensure database exists: `CREATE DATABASE incident_reporting;`

### Issue: "Email notifications not working"

**Solution:**
- For Gmail: Enable 2-factor authentication and create an App Password
- Update `EMAIL_USER` and `EMAIL_PASSWORD` in `backend/.env`
- Check spam folder for test emails

### Issue: "File upload failed"

**Solution:**
- Ensure `backend/uploads` directory exists and is writable
- Check `MAX_FILE_SIZE` in `backend/.env`
- Verify CORS settings allow file uploads

---

## Production Deployment

### Frontend

1. Update `.env` with production values:
   ```env
   VITE_API_URL=https://your-api-domain.com
   VITE_GOOGLE_MAPS_API_KEY=your-production-google-maps-key
   ```

2. Build the frontend:
   ```bash
   npm run build
   ```

3. Deploy the `dist` folder to your hosting provider

### Backend

1. Update `backend/.env` with production values
2. Set `NODE_ENV=production`
3. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name incident-api
   ```

---

## Security Notes

- **Never commit `.env` files to version control**
- Change `JWT_SECRET` to a strong random string in production
- Use environment-specific variables for different environments
- Keep your Google Maps API key restricted to specific domains
- Use strong database passwords
- Enable SSL/TLS in production

---

## Next Steps

1. ✅ Set up frontend `.env` file
2. ✅ Set up backend `.env` file
3. ✅ Install dependencies for both frontend and backend
4. ✅ Create MySQL database
5. ✅ Start backend server
6. ✅ Start frontend server
7. ✅ Test signup/login functionality
8. ✅ Test incident creation
9. ✅ Test email notifications (optional)
10. ✅ Configure Google Maps API key (optional)

---

For more details, see:
- [Backend Setup Guide](./backend/README.md)
- [Backend Quick Start](./backend/QUICK_START.md)
- [Backend Integration Guide](./BACKEND_INTEGRATION_GUIDE.md)
