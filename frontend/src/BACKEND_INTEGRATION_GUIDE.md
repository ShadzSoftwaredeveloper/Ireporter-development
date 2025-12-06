# Backend Integration Guide

## 🎯 Overview

This guide will help you integrate the Express.js backend with your React frontend.

## 📁 What Was Created

A complete backend API in the `/backend` folder with:

✅ **Express.js Server** with security middleware (Helmet, CORS)
✅ **PostgreSQL Database** with Sequelize ORM
✅ **JWT Authentication** with role-based access control
✅ **RESTful API Endpoints** for incidents, notifications, and users
✅ **Email Service** supporting SendGrid, Gmail, and SMTP
✅ **Auto-migration** of database tables
✅ **Complete Documentation** in `/backend/README.md`

## 🚀 Backend Setup Steps

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Set Up PostgreSQL Database

You have two options:

#### Option A: Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a database:
   ```bash
   psql -U postgres
   CREATE DATABASE incident_reporting;
   \q
   ```

#### Option B: Cloud PostgreSQL (Recommended)

Choose one of these free options:
- **Neon**: [neon.tech](https://neon.tech) - Free PostgreSQL with generous limits
- **Supabase**: [supabase.com](https://supabase.com) - Free tier with PostgreSQL
- **ElephantSQL**: [elephantsql.com](https://elephantsql.com) - Free tier available
- **Railway**: [railway.app](https://railway.app) - Free PostgreSQL database

### Step 3: Configure Environment Variables

```bash
cd backend
cp .env.example .env
```

Edit the `.env` file with your credentials:

```env
# Server
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database (use your credentials here)
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=incident_reporting
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_SSL=true  # Set to true for cloud databases

# JWT
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRE=7d

# Email (choose one option below)
EMAIL_SERVICE=smtp
EMAIL_FROM=noreply@incidentreporting.com

# For testing: Use Mailtrap (free)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-mailtrap-user
SMTP_PASSWORD=your-mailtrap-password
```

### Step 4: Start the Backend Server

```bash
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

You should see:
```
✅ Database connection established successfully
✅ Database models synchronized
🚀 Server is running on port 5000
```

### Step 5: Test the API

Visit: `http://localhost:5000`

You should see:
```json
{
  "message": "Incident Reporting API",
  "version": "1.0.0",
  "endpoints": {
    "health": "/api/health",
    "auth": "/api/auth",
    "incidents": "/api/incidents",
    "notifications": "/api/notifications",
    "users": "/api/users"
  }
}
```

## 🔗 Frontend Integration

### Step 1: Create API Service File

Create `/src/services/api.ts`:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// API client with auth headers
const apiClient = {
  get: async (endpoint: string) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  post: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  put: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (endpoint: string) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },
};

export default apiClient;
```

### Step 2: Update AuthContext

Update `/contexts/AuthContext.tsx` to use the real API:

```typescript
import apiClient from '../services/api';

// In signIn function:
const signIn = async (email: string, password: string) => {
  const response = await apiClient.post('/auth/signin', { email, password });
  
  if (response.status === 'success') {
    const { user, token } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setUser(user);
  } else {
    throw new Error(response.message);
  }
};

// In signUp function:
const signUp = async (email: string, password: string, name: string) => {
  const response = await apiClient.post('/auth/signup', { email, password, name });
  
  if (response.status === 'success') {
    const { user, token } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setUser(user);
  } else {
    throw new Error(response.message);
  }
};
```

### Step 3: Update DataContext

Update `/contexts/DataContext.tsx` to use the real API:

```typescript
import apiClient from '../services/api';

// In createIncident function:
const createIncident = async (incident: Omit<Incident, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
  const response = await apiClient.post('/incidents', incident);
  
  if (response.status === 'success') {
    setIncidents([...incidents, response.data.incident]);
    if (onIncidentCreate) {
      onIncidentCreate(response.data.incident);
    }
  }
};

// In updateIncident function:
const updateIncident = async (id: string, updates: Partial<Incident>) => {
  const response = await apiClient.put(`/incidents/${id}`, updates);
  
  if (response.status === 'success') {
    const updatedIncidents = incidents.map((incident) =>
      incident.id === id ? response.data.incident : incident
    );
    setIncidents(updatedIncidents);
    
    // Trigger notification if admin updated status
    if (updates.status && onStatusUpdate) {
      const oldIncident = incidents.find((i) => i.id === id);
      if (oldIncident) {
        onStatusUpdate(response.data.incident, oldIncident.status, updates.status);
      }
    }
  }
};
```

### Step 4: Update NotificationContext

Update `/contexts/NotificationContext.tsx`:

```typescript
import apiClient from '../services/api';

// Load notifications from API
useEffect(() => {
  const fetchNotifications = async () => {
    if (user) {
      const response = await apiClient.get('/notifications');
      if (response.status === 'success') {
        setNotifications(response.data.notifications);
      }
    }
  };
  fetchNotifications();
}, [user]);
```

### Step 5: Add Environment Variable

Create or update `/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## 📧 Email Service Setup

### Option 1: Mailtrap (Best for Testing)

1. Sign up at [mailtrap.io](https://mailtrap.io)
2. Create an inbox
3. Copy SMTP credentials
4. Update `.env`:
   ```env
   EMAIL_SERVICE=smtp
   SMTP_HOST=smtp.mailtrap.io
   SMTP_PORT=2525
   SMTP_USER=your_username
   SMTP_PASSWORD=your_password
   ```

### Option 2: SendGrid (Best for Production)

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create API key
3. Update `.env`:
   ```env
   EMAIL_SERVICE=sendgrid
   SENDGRID_API_KEY=your_api_key
   EMAIL_FROM=noreply@yourdomain.com
   ```

### Option 3: Gmail (Quick Setup)

1. Enable 2-Step Verification in Google Account
2. Create App Password (Google Account > Security > App Passwords)
3. Update `.env`:
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   EMAIL_FROM=your_email@gmail.com
   ```

## 🧪 Testing the Full Stack

### 1. Test Backend API

```bash
# Health check
curl http://localhost:5000/api/health

# Create admin user
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123","name":"Admin User","role":"admin"}'

# Create regular user
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"user123","name":"Test User","role":"user"}'
```

### 2. Test Frontend Integration

1. Start both servers:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   npm run dev
   ```

2. Open `http://localhost:5173`
3. Sign up as a user
4. Create an incident
5. Check backend console for email logs
6. Sign in as admin
7. Check for notification
8. Update incident status
9. Sign in as user again
10. Check for status update notification

## 🔍 Troubleshooting

### Database Connection Issues

```
❌ Unable to connect to database
```

**Solution**: Check your database credentials in `.env`. For cloud databases, ensure `DB_SSL=true`.

### CORS Errors

```
Access to fetch at 'http://localhost:5000' from origin 'http://localhost:5173' has been blocked by CORS
```

**Solution**: Ensure `FRONTEND_URL=http://localhost:5173` in backend `.env`

### Email Not Sending

```
❌ Email server connection failed
```

**Solution**: 
1. Check email credentials in `.env`
2. For Gmail, use App Password not regular password
3. For Mailtrap, verify credentials from dashboard

### JWT Token Issues

```
Invalid token. Authorization denied.
```

**Solution**: 
1. Clear localStorage and login again
2. Ensure `JWT_SECRET` is set in `.env`
3. Check if token is being sent in Authorization header

## 📊 Database Schema

The backend will automatically create these tables:

- `Users` - User accounts with authentication
- `Incidents` - Incident reports with location and media
- `Notifications` - In-app notifications for users and admins

## 🎉 Success Checklist

Before moving to production, verify:

- [ ] Backend server starts without errors
- [ ] Database connection successful
- [ ] Frontend can sign up new users
- [ ] Frontend can sign in existing users
- [ ] Frontend can create incidents
- [ ] Admins receive notifications for new incidents
- [ ] Admins can update incident status
- [ ] Users receive notifications for status updates
- [ ] Email service is working (check logs)
- [ ] All API endpoints return expected data

## 🚀 Next Steps

1. **Set up production database** (Neon, Supabase, etc.)
2. **Configure production email service** (SendGrid recommended)
3. **Deploy backend** (Heroku, Railway, AWS, etc.)
4. **Update frontend API URL** to production backend
5. **Test end-to-end** in production environment

## 📞 Need Help?

Common issues and solutions are in `/backend/README.md`

---

**You're all set!** Provide your database credentials and email service details, update the `.env` file, and you'll have a fully functional backend API with real email notifications!