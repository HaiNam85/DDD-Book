# PostgreSQL Database Setup Guide

## Quick Fix for Authentication Error

If you're getting `password authentication failed for user "postgres"`, follow these steps:

### Step 1: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE story_website;

# Exit
\q
```

### Step 2: Update .env File

Create or update the `backend/.env` file with the correct password:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=story_website
DB_USER=postgres
DB_PASSWORD=123456
```

**Important**: Replace `123456` with your actual PostgreSQL password.

### Step 3: Run Database Schema

```bash
# From the backend directory
psql -U postgres -d story_website -f database/schema.sql
```

### Step 4: Restart Backend

```bash
cd backend
npm start
```

## Find Your PostgreSQL Password

### If you forgot your PostgreSQL password:

**Windows (pgAdmin):**
- Open pgAdmin
- Check connection settings

**Or reset the password:**

```bash
# On Windows, edit pg_hba.conf
# Usually located at: C:\Program Files\PostgreSQL\XX\data\pg_hba.conf

# Change this line from:
# host all all 127.0.0.1/32 md5
# to:
# host all all 127.0.0.1/32 trust

# Then restart PostgreSQL service
```

**Or use psql with trust authentication:**

```bash
# Connect without password
psql -U postgres

# Change password
ALTER USER postgres WITH PASSWORD 'new_password';
```

## Common Issues

### Issue 1: Database doesn't exist

**Error**: `database "story_website" does not exist`

**Solution**:
```bash
createdb story_website
```

### Issue 2: Wrong database name

**Error**: Connection to wrong database

**Solution**: Change `DB_NAME` in `.env` to `story_website`

### Issue 3: PostgreSQL not running

**Error**: Connection refused

**Solution**:
```bash
# Windows
net start postgresql-x64-14

# Or check Services
```

## Verification

After setup, you should see:

```
Server is running on port 5000
Connected to PostgreSQL database
⚠️  Redis caching: DISABLED
```

## Testing the Connection

```bash
# Test connection with psql
psql -U postgres -d story_website -c "SELECT version();"
```

## Default Credentials

- **Default User**: `postgres`
- **Default Password**: Depends on your installation
- **Default Port**: `5432`
- **Default Host**: `localhost`

If you installed PostgreSQL without setting a password, try:
- Empty password: `DB_PASSWORD=`
- Or: `postgres`
- Or: Your Windows user password
