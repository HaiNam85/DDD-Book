# Fix: Redis Error Logs

## Problem

You're seeing Redis error logs even though Redis caching is disabled.

## Solution

The issue is that the `.env` file doesn't exist yet. The application is trying to use Redis by default.

### Step 1: Create the .env file

In the `backend` directory, create a `.env` file with the following content:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=story_website
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# Redis Configuration
# Set ENABLE_REDIS=false to disable caching
ENABLE_REDIS=false
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Important**: Change `DB_PASSWORD` to your actual PostgreSQL password.

### Step 2: Restart the backend server

After creating the `.env` file, restart your backend server:

```bash
cd backend
npm start
```

### Expected Output

You should now see:

```
Server is running on port 5000
Using PostgreSQL database
⚠️  Redis caching: DISABLED
   Set ENABLE_REDIS=true in .env to enable caching
```

No more Redis errors! ✅

### What Changed?

I updated the code to:
1. ✅ Check `ENABLE_REDIS` before creating Redis client
2. ✅ Skip Redis connection entirely when disabled
3. ✅ Show proper status on server startup

### To Enable Redis Later

Just change `ENABLE_REDIS=false` to `ENABLE_REDIS=true` in the `.env` file.

### Quick Copy Command

```bash
# Copy the example file to create .env
cp backend/env.example backend/.env

# Then edit backend/.env and set:
# - DB_PASSWORD=your_actual_password
# - ENABLE_REDIS=false (already set)
```
