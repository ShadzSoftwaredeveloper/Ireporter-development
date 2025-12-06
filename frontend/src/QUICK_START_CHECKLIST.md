# Quick Start Checklist

Follow these steps to get your Incident Reporting Application up and running.

## Prerequisites ✅

Before you begin, ensure you have:

- [ ] **Node.js** (v14 or higher) installed - [Download](https://nodejs.org/)
- [ ] **MySQL** (v5.7 or v8.0) installed and running - [Download](https://dev.mysql.com/downloads/)
- [ ] **npm** or **yarn** package manager
- [ ] **Git** (optional, for version control)
- [ ] A **Gmail account** (for email notifications) or other SMTP service
- [ ] **Google Maps API Key** (optional, for map features) - [Get Key](https://console.cloud.google.com/)

---

## Step 1: Frontend Setup 🎨

### 1.1 Create Environment File

```bash
# In the root directory
cp .env.example .env
```

### 1.2 Edit `.env` File

Open `.env` and update:

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY_HERE
```

> **Note:** You can leave `VITE_GOOGLE_MAPS_API_KEY` as is for now and update it later when you have an API key.

### 1.3 Install Frontend Dependencies

```bash
npm install
```

⏱️ This will take 1-2 minutes.

---

## Step 2: Backend Setup ⚙️

### 2.1 Navigate to Backend Directory

```bash
cd backend
```

### 2.2 Create Backend Environment File

```bash
cp .env.example .env
```

### 2.3 Edit `backend/.env` File

Open `backend/.env` and update these critical values:

```env
# Database - Update with your MySQL password
DB_PASSWORD=your_mysql_password_here

# Email - Update with your Gmail credentials
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password-here

# Keep these as defaults for development
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_NAME=incident_reporting
```

> **Important:** For Gmail, you need an App Password, not your regular password. See [Email Setup Guide](#email-setup-guide) below.

### 2.4 Install Backend Dependencies

```bash
npm install
```

⏱️ This will take 1-2 minutes.

---

## Step 3: Database Setup 🗄️

### 3.1 Start MySQL

Ensure MySQL is running on your system.

**macOS (Homebrew):**
```bash
mysql.server start
```

**Linux:**
```bash
sudo service mysql start
```

**Windows:**
- Start MySQL from Services or MySQL Workbench

### 3.2 Create Database

```bash
mysql -u root -p
```

Enter your MySQL password, then run:

```sql
CREATE DATABASE incident_reporting;
SHOW DATABASES;
exit;
```

> **Note:** Tables will be created automatically when you start the backend server.

---

## Step 4: Start the Application 🚀

### 4.1 Start Backend Server

From the `backend` directory:

```bash
npm start
```

Or for development mode with auto-restart:

```bash
npm run dev
```

You should see:
```
✅ Database connected successfully
🚀 Server running on port 5000
```

**Keep this terminal open!**

### 4.2 Start Frontend Server

Open a **new terminal** window/tab, navigate to the root directory:

```bash
# If you're in backend directory:
cd ..

# Start frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

**Keep this terminal open too!**

### 4.3 Open the Application

Open your browser and navigate to:
```
http://localhost:5173
```

---

## Step 5: Test the Application ✨

### 5.1 Create an Account

1. Click **"Sign Up"** or **"Get Started"**
2. Fill in the registration form:
   - Full Name
   - Email
   - Password
3. Click **"Create Account"**

✅ You should be automatically logged in and redirected to the dashboard.

### 5.2 Create a Test Incident

1. Click **"Create Incident"** or navigate to the create incident page
2. Fill in incident details:
   - Title
   - Description
   - Category
   - Priority
   - Location (use map picker or enter address)
3. Optionally upload images/videos
4. Click **"Submit"**

✅ The incident should be created successfully.

### 5.3 View Incidents

1. Navigate to **"View Incidents"**
2. You should see your created incident in the list
3. Click on it to view details

---

## Email Setup Guide 📧

To enable email notifications, you need to configure Gmail with an App Password.

### For Gmail Users:

1. **Enable 2-Factor Authentication:**
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Create App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select app: **Mail**
   - Select device: **Other (Custom name)** → Enter "Incident Reporting"
   - Click **Generate**
   - Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`)

3. **Update `backend/.env`:**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
   EMAIL_FROM=your-email@gmail.com
   ```

4. **Restart Backend Server**

### For Other Email Providers:

Check your email provider's SMTP settings and update `backend/.env` accordingly.

---

## Google Maps Setup (Optional) 🗺️

Maps will work with a placeholder until you add a real API key.

### To enable full map functionality:

1. **Create Google Cloud Project:**
   - Go to https://console.cloud.google.com/
   - Create a new project or select existing

2. **Enable APIs:**
   - Maps JavaScript API
   - Places API
   - Geocoding API

3. **Create API Key:**
   - Go to **Credentials**
   - Click **Create Credentials** → **API Key**
   - Copy the API key

4. **Update `.env`:**
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

5. **Restart Frontend Server**

6. **Set Restrictions (Recommended):**
   - In Google Cloud Console, edit your API key
   - Add HTTP referrer: `http://localhost:5173/*`
   - For production, add your production domain

---

## Verification Checklist ✓

Before moving on, verify:

- [ ] Frontend is accessible at `http://localhost:5173`
- [ ] Backend is running at `http://localhost:5000`
- [ ] You can create an account
- [ ] You can log in
- [ ] You can create an incident
- [ ] You can view incidents
- [ ] Email notifications work (if configured)
- [ ] Map picker works (if Google Maps API configured)

---

## Common Issues 🔧

### Issue: Environment variable error

**Error:** `Cannot read properties of undefined (reading 'VITE_API_URL')`

**Solution:**
1. Ensure `.env` file exists in root directory
2. **Restart the frontend dev server** (this is critical!)
3. Check variable names start with `VITE_`

---

### Issue: Cannot connect to backend

**Error:** `Network Error` or `Failed to fetch`

**Solution:**
1. Verify backend is running: `http://localhost:5000/api/health`
2. Check `VITE_API_URL` in `.env` matches backend URL
3. Ensure no firewall blocking port 5000

---

### Issue: Database connection failed

**Error:** `Access denied` or `Unknown database`

**Solution:**
1. Verify MySQL is running
2. Check credentials in `backend/.env`
3. Ensure database exists: `CREATE DATABASE incident_reporting;`

---

### Issue: Email not sending

**Solution:**
1. Verify you're using an App Password, not your regular Gmail password
2. Check EMAIL_USER and EMAIL_PASSWORD in `backend/.env`
3. Restart backend server
4. Check spam folder

---

For more detailed troubleshooting, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## What's Next? 🎯

Now that your application is running:

1. **Explore Features:**
   - User Dashboard
   - Admin Dashboard (create admin user)
   - Notifications
   - User Profile
   - Settings

2. **Test Role-Based Access:**
   - Create incidents as user
   - Update incident status as admin
   - View notifications

3. **Customize:**
   - Update branding/styling
   - Configure email templates
   - Add custom incident categories

4. **Prepare for Production:**
   - Set up production database
   - Configure production environment variables
   - Set up proper email service
   - Deploy to hosting provider

---

## Admin User Setup

By default, users sign up with the 'user' role. To create an admin user:

### Option 1: Direct Database Update

```bash
mysql -u root -p
```

```sql
USE incident_reporting;
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
exit;
```

### Option 2: Sign Up and Update

1. Sign up normally
2. Use SQL to update role
3. Log out and log back in

---

## Architecture Overview

```
┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │
│    Frontend     │◄───────►│     Backend     │
│   (React +      │  HTTP   │   (Express +    │
│   TypeScript)   │  JSON   │    MySQL)       │
│                 │         │                 │
└─────────────────┘         └────────┬────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │                 │
                            │  MySQL Database │
                            │                 │
                            └─────────────────┘
```

**Ports:**
- Frontend: `5173` (Vite dev server)
- Backend: `5000` (Express API)
- Database: `3306` (MySQL default)

---

## Development Tips 💡

1. **Keep both terminals visible** to see logs from frontend and backend
2. **Use browser DevTools** (F12) to debug frontend issues
3. **Check backend terminal** for API errors and database logs
4. **Install recommended extensions** for VS Code:
   - ESLint
   - Prettier
   - MySQL (for database management)

---

## Support & Documentation 📚

- [Environment Setup Guide](./ENVIRONMENT_SETUP.md) - Detailed environment configuration
- [Troubleshooting Guide](./TROUBLESHOOTING.md) - Common issues and solutions
- [Backend README](./backend/README.md) - Backend API documentation
- [Backend Integration Guide](./BACKEND_INTEGRATION_GUIDE.md) - Frontend-backend integration

---

## Success! 🎉

If you've completed all steps, you now have a fully functional incident reporting application with:

- ✅ User authentication (signup/login)
- ✅ Role-based access control (user/admin)
- ✅ Incident creation and management
- ✅ Real-time notifications
- ✅ Email notifications
- ✅ File uploads (images/videos)
- ✅ Interactive maps
- ✅ User profiles and dashboards
- ✅ Admin dashboard with analytics

**Happy developing! 🚀**
