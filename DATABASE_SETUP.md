# Database Setup Instructions

## 🚀 Quick Start (Recommended: Neon Cloud Database)

### Option 1: Neon Database (Free, Cloud-based, No Installation)

1. **Create Neon Account:**
   - Go to https://neon.tech
   - Sign up with GitHub/Google/Email (free)
   
2. **Create Project:**
   - Click "Create a project"
   - Name: `Hostel360`
   - Region: Choose closest to you
   - Click "Create Project"

3. **Get Connection String:**
   - Copy the connection string (looks like: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`)
   
4. **Update .env file:**
   ```bash
   DATABASE_URL=your_neon_connection_string_here
   PORT=5001
   ```

5. **Run Migrations:**
   ```bash
   npm run db:push
   ```

6. **Restart Server:**
   - Stop current server (Ctrl+C in terminal)
   - Run: `npm run dev`

✅ **Done!** Your data will now persist even after server restarts.

---

## 🏠 Option 2: Local PostgreSQL

### Step 1: Install PostgreSQL

1. Download from: https://www.postgresql.org/download/windows/
2. Install (keep defaults)
3. Remember the password you set for `postgres` user
4. Default port: 5432

### Step 2: Create Database

Open **pgAdmin** or **SQL Shell (psql)** and run:

```sql
CREATE DATABASE hostel_db;
```

### Step 3: Update .env

```bash
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/hostel_db
PORT=5001
```

Replace `YOUR_PASSWORD` with the password you set during PostgreSQL installation.

### Step 4: Run Migrations

```bash
npm run db:push
```

### Step 5: Restart Server

Stop and restart: `npm run dev`

---

## 📋 Database Commands Reference

```bash
# Push schema to database (creates/updates tables)
npm run db:push

# Generate migration files
npm run db:generate

# Apply migrations
npm run db:migrate

# Open Drizzle Studio (visual database viewer)
npm run db:studio
```

---

## 🔍 Verify Database Connection

After setup, you should see in the terminal:
```
✅ Server running locally at:  http://localhost:5001
```

**No error about DATABASE_URL** = Success!

---

## ⚠️ Current Status

**Right now:** Using in-memory storage (data lost on restart)

**After setup:** PostgreSQL database (data persists)

---

## 🐛 Troubleshooting

### Error: "DATABASE_URL must be set"
- Check `.env` file exists in project root
- Verify DATABASE_URL is not empty
- Restart server after creating .env

### Error: "Connection refused"
- **Neon:** Check internet connection, verify connection string
- **Local:** Ensure PostgreSQL service is running

### Error: "Authentication failed"
- Check username/password in DATABASE_URL
- For local: verify postgres password is correct

### Tables not created
- Run: `npm run db:push`
- Check terminal for errors

---

## 📊 What Gets Created

After running `npm run db:push`, these tables will be created:

- ✅ users
- ✅ rooms
- ✅ complaints
- ✅ mess_feedback
- ✅ visitors
- ✅ lost_found
- ✅ sos_alerts
- ✅ events

All your existing features will work with persistent data!

