# ✅ Backend Setup Complete!

## 🎉 What's Been Created

A complete **Express.js + PostgreSQL** backend has been created in the `/backend` folder!

## 📁 Backend Structure

```
/backend
├── config/
│   └── database.js              # PostgreSQL connection
├── controllers/
│   ├── auth.controller.js       # Authentication logic
│   ├── incident.controller.js   # Incident CRUD operations
│   └── notification.controller.js # Notification management
├── middleware/
│   └── auth.middleware.js       # JWT verification & authorization
├── models/
│   ├── User.model.js           # User model with password hashing
│   ├── Incident.model.js       # Incident model
│   ├── Notification.model.js   # Notification model
│   └── index.js                # Model associations
├── routes/
│   ├── auth.routes.js          # Auth endpoints
│   ├── incident.routes.js      # Incident endpoints
│   ├── notification.routes.js  # Notification endpoints
│   └── user.routes.js          # User management endpoints
├── utils/
│   └── emailService.js         # Email sending service
├── uploads/                     # For file uploads
├── .env.example                # Environment variables template
├── .gitignore
├── package.json
├── QUICK_START.md              # 5-minute setup guide
├── README.md                   # Complete documentation
└── server.js                   # Express app & server
```

## ✨ Key Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (User/Admin)
- Protected routes

### 📊 Incident Management
- Create, read, update, delete incidents
- Role-based permissions
- Status tracking (draft, under-investigation, resolved, rejected)
- Location data with lat/lng coordinates
- Media support (images/videos)

### 🔔 Notification System
- Real-time notifications for users and admins
- Automatic notifications on incident creation
- Automatic notifications on status updates
- Mark as read/unread functionality

### 📧 Email Service
- Supports SendGrid, Gmail, and SMTP
- Professional HTML email templates
- Automatic emails to admins when incidents are created
- Automatic emails to users when status is updated

### 🛡️ Security
- Helmet.js for security headers
- CORS configuration
- JWT token validation
- Password hashing
- Input validation

## 🚀 Quick Start (3 Steps)

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your database and email credentials
```

### 3. Start Server
```bash
npm run dev
```

That's it! The server will be running at `http://localhost:5000`

## 📋 What You Need to Provide

### Required: PostgreSQL Database Credentials
```env
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=incident_reporting
DB_USER=your-username
DB_PASSWORD=your-password
DB_SSL=true  # For cloud databases
```

**Free PostgreSQL Options:**
- [Neon.tech](https://neon.tech) - Recommended
- [Supabase](https://supabase.com)
- [ElephantSQL](https://elephantsql.com)
- [Railway](https://railway.app)

### Required: Email Service Credentials

**For Testing (Recommended):**
```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-mailtrap-user
SMTP_PASSWORD=your-mailtrap-password
```

Get free account at [mailtrap.io](https://mailtrap.io)

**For Production:**
- SendGrid: [sendgrid.com](https://sendgrid.com)
- Gmail with App Password
- Custom SMTP server

## 📚 Documentation Files

| File | Description |
|------|-------------|
| `/backend/QUICK_START.md` | 5-minute setup guide |
| `/backend/README.md` | Complete backend documentation |
| `/BACKEND_INTEGRATION_GUIDE.md` | How to connect frontend to backend |
| `/backend/.env.example` | Environment variables template |

## 🔗 API Endpoints

Once running, the API will be available at `http://localhost:5000/api`

### Authentication
- `POST /api/auth/signup` - Register
- `POST /api/auth/signin` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Incidents
- `GET /api/incidents` - Get all incidents
- `POST /api/incidents` - Create incident
- `GET /api/incidents/:id` - Get incident
- `PUT /api/incidents/:id` - Update incident
- `DELETE /api/incidents/:id` - Delete incident
- `GET /api/incidents/stats/overview` - Get stats (admin)

### Notifications
- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### Users
- `GET /api/users` - Get all users (admin)
- `DELETE /api/users/:id` - Delete user (admin)

## 🎯 Workflow

### When User Creates Incident:
1. ✅ Incident saved to PostgreSQL database
2. 🔔 Notifications created for all admins
3. 📧 Email sent to all admins
4. 💾 Real-time notification in admin dashboard

### When Admin Updates Status:
1. ✅ Incident status updated in database
2. 🔔 Notification created for incident owner
3. 📧 Email sent to incident owner
4. 💾 Real-time notification in user dashboard

## 🧪 Testing the Backend

### 1. Test Server Health
```bash
curl http://localhost:5000/api/health
```

### 2. Create Test User
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "role": "user"
  }'
```

### 3. Create Test Admin
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123",
    "name": "Admin User",
    "role": "admin"
  }'
```

### 4. Login
```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Copy the token from the response for authenticated requests.

## 🔄 Connecting Frontend to Backend

The frontend is currently using localStorage for data persistence. To connect it to the real backend:

1. **Create API service** in frontend (`/src/services/api.ts`)
2. **Update contexts** to use API calls instead of localStorage
3. **Set environment variable** `VITE_API_URL=http://localhost:5000/api`
4. **Test the integration** with both servers running

Full integration instructions are in `/BACKEND_INTEGRATION_GUIDE.md`

## ✅ Pre-Deployment Checklist

Before deploying to production:

- [ ] Backend server starts without errors
- [ ] Database connection successful
- [ ] Can create and authenticate users
- [ ] Can create and manage incidents
- [ ] Notifications are created correctly
- [ ] Emails are being sent (check logs or Mailtrap)
- [ ] All API endpoints return expected responses
- [ ] CORS is configured for production frontend URL
- [ ] Environment variables are set securely
- [ ] Database has SSL enabled (for cloud databases)

## 🚀 Deployment Options

### Backend Hosting
- **Heroku** - Easy deployment with Heroku Postgres
- **Railway** - Modern platform with PostgreSQL
- **Render** - Free tier available
- **DigitalOcean** - App Platform
- **AWS** - EC2 + RDS

### Database Hosting
- **Neon** - Serverless PostgreSQL (Recommended)
- **Supabase** - PostgreSQL with extras
- **Railway** - Managed PostgreSQL
- **AWS RDS** - Production-ready

### Email Service
- **SendGrid** - 100 emails/day free
- **Mailgun** - Reliable transactional emails
- **AWS SES** - Cost-effective for high volume

## 🎓 Learning Resources

- **Express.js**: [expressjs.com](https://expressjs.com)
- **Sequelize**: [sequelize.org](https://sequelize.org)
- **PostgreSQL**: [postgresql.org](https://postgresql.org)
- **JWT**: [jwt.io](https://jwt.io)
- **Nodemailer**: [nodemailer.com](https://nodemailer.com)

## 💡 Tips

1. **Use Mailtrap** for testing emails - it catches all emails so you don't accidentally send test emails to real users
2. **Start with cloud database** like Neon - easier than local PostgreSQL setup
3. **Check server logs** for detailed error messages
4. **Test with curl** before connecting frontend - easier to debug
5. **Keep `.env` secure** - never commit it to git

## 🆘 Getting Help

1. Check server console logs for errors
2. Review `/backend/README.md` for detailed documentation
3. Test API endpoints with curl or Postman
4. Verify database connection and email configuration
5. Check that all environment variables are set correctly

## 🎉 You're Ready!

Once you provide your database credentials and email service configuration:

1. Update `/backend/.env` with your credentials
2. Run `npm run dev` in the `/backend` folder
3. Server will start and automatically create database tables
4. Test the API endpoints
5. Connect your frontend
6. Deploy to production!

---

**Need the credentials guide?** See `/backend/QUICK_START.md` for a 5-minute setup!

**Ready to integrate?** See `/BACKEND_INTEGRATION_GUIDE.md` for frontend connection steps!

**Full documentation?** See `/backend/README.md` for complete API documentation!
