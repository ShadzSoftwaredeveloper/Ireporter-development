# Migration to MySQL - Summary of Changes

## ✅ Changes Completed

### 1. Backend Database Configuration (MySQL)

#### Updated Files:
- **`/backend/config/database.js`**
  - Changed dialect from `postgres` to `mysql`
  - Updated default port from `5432` to `3306`
  - Updated default user from `postgres` to `root`
  - Removed SSL dialect options (not needed for local MySQL)

- **`/backend/package.json`**
  - Removed `pg` and `pg-hstore` (PostgreSQL drivers)
  - Added `mysql2` package for MySQL support

#### Created Files:
- **`/backend/.env.example`** - Environment template with MySQL configuration
- **`/backend/.gitignore`** - Git ignore rules for node_modules, .env, uploads, etc.
- **`/backend/uploads/.gitkeep`** - Ensures uploads directory exists in git

### 2. Signup Form Changes

#### Updated Files:
- **`/pages/SignUp.tsx`**
  - Removed role/account type selection field
  - Removed Select component imports for role selection
  - Updated state to remove `role` variable
  - All new users are now created as 'user' role by default

- **`/contexts/AuthContext.tsx`**
  - Updated `signUp` function to remove role parameter
  - All new users are automatically assigned 'user' role
  - Simplified signup logic

- **`/backend/controllers/auth.controller.js`**
  - Removed role from request body
  - All new users are created with 'user' role
  - Added comment explaining default behavior

### 3. Documentation Updates

#### Updated Files:
- **`/backend/README.md`**
  - Updated all references from PostgreSQL to MySQL
  - Changed database setup instructions
  - Updated port numbers (5432 → 3306)
  - Updated database user defaults

- **`/backend/QUICK_START.md`**
  - Updated environment variable examples
  - Changed database recommendations to MySQL-specific services
  - Added PlanetScale, Railway as MySQL cloud options

- **`/BACKEND_INTEGRATION_GUIDE.md`**
  - Updated signup function examples to remove role parameter

## 🗄️ MySQL Setup Instructions

### Option 1: Local MySQL

```bash
# Install MySQL on your machine
# Then create the database:
mysql -u root -p
CREATE DATABASE incident_reporting;
exit;
```

Update `/backend/.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=incident_reporting
DB_USER=root
DB_PASSWORD=your_mysql_password
```

### Option 2: Cloud MySQL (Recommended)

**PlanetScale** (Free tier available)
- Go to [planetscale.com](https://planetscale.com)
- Create a database
- Copy connection credentials to `.env`

**Railway** (Simple deployment)
- Go to [railway.app](https://railway.app)
- Add MySQL service
- Copy credentials to `.env`

## 📝 Required Actions

### 1. Install MySQL Driver

```bash
cd backend
npm install
```

This will install the `mysql2` package.

### 2. Set Up Database

Choose one of the options above and create the database.

### 3. Configure Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your MySQL credentials.

### 4. Start Backend

```bash
cd backend
npm run dev
```

The server will automatically create the necessary tables.

## 🔄 Migration from Existing PostgreSQL Data

If you have existing data in PostgreSQL and want to migrate to MySQL:

1. **Export data from PostgreSQL:**
   ```bash
   pg_dump -U postgres incident_reporting > backup.sql
   ```

2. **Convert PostgreSQL syntax to MySQL** (mainly data types and sequences)
   - Use a tool like [pgloader](https://pgloader.io/) or manually convert

3. **Import to MySQL:**
   ```bash
   mysql -u root -p incident_reporting < converted_backup.sql
   ```

## 🎯 Key Differences

### PostgreSQL vs MySQL in Your App

| Feature | PostgreSQL | MySQL |
|---------|-----------|-------|
| Port | 5432 | 3306 |
| Default User | postgres | root |
| JSONB Support | Native | JSON (similar) |
| UUID | Native | VARCHAR(36) |
| Package | pg, pg-hstore | mysql2 |

Sequelize handles most differences automatically, so your models don't need changes!

### ✨ Signup Flow Changes

### Before:
1. User enters name, email, password
2. User selects account type (User/Admin) ⚠️
3. (Previously) User verification could include OTP
4. Account created with selected role

### After:
1. User enters name, email, password
2. Account created automatically as 'user' role ✅

**Admin accounts** can now only be created:
- Directly in the database
- Through a separate admin creation endpoint (if you add one)
- By promoting existing users in the database

## 🔒 Security Note

Removing role selection from signup is a security best practice:
- Prevents users from creating admin accounts
- Ensures proper role-based access control
- Admin accounts should be created through secure channels only

## 🧪 Testing

### Test the Changes:

1. **Start backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Verify database connection:**
   Check console for:
   ```
   ✅ Database connection established successfully
   ✅ Database models synchronized
   ```

3. **Test signup:**
   - Open frontend: `http://localhost:5173`
   - Go to signup page
   - Verify no role selection field
   - Create a new user
   - Check database to confirm role is 'user'

4. **Test admin login:**
   - Use existing admin credentials from demo data
   - Or create admin directly in database:
     ```sql
     UPDATE Users SET role = 'admin' WHERE email = 'your@email.com';
     ```

## 📚 Additional Resources

- MySQL Documentation: [dev.mysql.com/doc](https://dev.mysql.com/doc/)
- Sequelize MySQL Guide: [sequelize.org/docs](https://sequelize.org/docs/v6/other-topics/dialect-specific-things/#mysql)
- PlanetScale: [planetscale.com/docs](https://planetscale.com/docs)

## ✅ Verification Checklist

- [ ] Backend dependencies installed (`mysql2` package)
- [ ] MySQL database created
- [ ] `.env` file configured with MySQL credentials
- [ ] Backend starts without errors
- [ ] Database tables created automatically
- [ ] Signup form no longer shows role selection
- [ ] New users are created with 'user' role
- [ ] Admin login still works
- [ ] Email notifications working

---

**All changes have been completed!** You can now run the application with MySQL instead of PostgreSQL, and the signup form will only create regular user accounts.
