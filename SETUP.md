# Setup Guide - Story Website

Complete setup instructions for the DDD-Book story reading website with Next.js, PostgreSQL, and Redis.

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
3. **Redis** (v6 or higher) - [Download](https://redis.io/download/)

### PostgreSQL Installation

#### Windows
1. Download PostgreSQL from the official website
2. Run the installer
3. Set a password for the postgres user (remember this!)
4. Complete the installation

#### macOS
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Redis Installation

#### Windows
- Download Redis for Windows from: https://github.com/microsoftarchive/redis/releases
- Or use WSL (Windows Subsystem for Linux)

#### macOS
```bash
# Using Homebrew
brew install redis
brew services start redis
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
```

## Database Setup

### 1. Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE story_website;

# Exit psql
\q
```

### 2. Run Database Schema

```bash
# From the project root
cd backend

# Run the schema file
psql -U postgres -d story_website -f database/schema.sql

# On Windows with password prompt:
psql -U postgres -d story_website -f database\schema.sql
```

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=story_website
DB_USER=postgres
DB_PASSWORD=your_postgres_password
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

**Important**: Change `DB_PASSWORD` to your actual PostgreSQL password and `JWT_SECRET` to a random secure string.

### 4. Start Backend Server

```bash
# Production mode
npm start

# Development mode (with auto-reload)
npm run dev
```

The backend server will be running at `http://localhost:5000`

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Start Development Server

```bash
npm run dev
```

The frontend will be running at `http://localhost:3000`

## Verify Installation

### Check Backend

1. Open `http://localhost:5000` in your browser
2. You should see: `{"message":"Story Website API with PostgreSQL and Redis"}`

### Check Frontend

1. Open `http://localhost:3000` in your browser
2. You should see the story website homepage

## Testing the Application

### 1. Create an Account

1. Click "Login" in the header
2. Click "Don't have an account? Sign up"
3. Fill in username, email, and password
4. Click "Sign Up"

### 2. Create Your First Story

1. Click "+ Create Story" in the header
2. Fill in the story details
3. Optionally upload a cover image
4. Click "Create Story"

### 3. Explore Features

- Browse stories on the homepage
- Click on a story to read it
- Add comments
- Like stories
- Search for stories
- Toggle dark/light mode

## Troubleshooting

### PostgreSQL Connection Issues

**Problem**: Cannot connect to PostgreSQL

**Solutions**:
- Ensure PostgreSQL is running
- Check if the port 5432 is available
- Verify credentials in `.env` file
- Try connecting with: `psql -U postgres`

### Redis Connection Issues

**Problem**: Redis connection error

**Solutions**:
- Ensure Redis is running: `redis-cli ping` (should return `PONG`)
- Check if the port 6379 is available
- On Windows, ensure WSL is properly configured

### Port Already in Use

**Problem**: Error: Port 5000 (backend) or 3000 (frontend) already in use

**Solutions**:
- Change port in `.env` file (backend) or `.env.local` (frontend)
- Or stop the application using that port

### Module Not Found Errors

**Problem**: Cannot find module errors

**Solutions**:
```bash
# Clean install
cd backend && rm -rf node_modules package-lock.json && npm install
cd frontend && rm -rf node_modules package-lock.json && npm install
```

### Database Schema Errors

**Problem**: Database schema errors

**Solutions**:
```bash
# Drop and recreate database
psql -U postgres -c "DROP DATABASE IF EXISTS story_website;"
psql -U postgres -c "CREATE DATABASE story_website;"
psql -U postgres -d story_website -f backend/database/schema.sql
```

## Production Deployment

### Environment Variables

Before deploying to production:

1. Change `JWT_SECRET` to a strong random string (64+ characters)
2. Use environment-specific database credentials
3. Configure Redis with password
4. Set `NODE_ENV=production`

### Build Commands

```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
npm start
```

### Recommended Hosting

- **Backend**: Heroku, DigitalOcean, AWS EC2
- **Frontend**: Vercel, Netlify, AWS Amplify
- **Database**: AWS RDS, DigitalOcean Managed PostgreSQL, Supabase
- **Redis**: Redis Cloud, AWS ElastiCache, DigitalOcean Managed Redis

## Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Support

For issues or questions:
1. Check this guide
2. Review error messages in terminal
3. Check browser console for frontend errors
4. Check network tab for API errors