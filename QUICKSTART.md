# Quick Start Guide

Get the Story Website running in 5 minutes!

## Prerequisites Check

Make sure you have:
- Node.js (v18+): `node --version`
- PostgreSQL (v12+): `psql --version`
- Redis (v6+): `redis-cli --version`

## One-Command Setup (Coming Soon)

```bash
# Run setup script
chmod +x setup.sh
./setup.sh
```

## Manual Setup (5 Steps)

### Step 1: Setup PostgreSQL

```bash
# Create database
createdb story_website

# Or using psql
psql -U postgres
CREATE DATABASE story_website;
\q
```

### Step 2: Run Database Schema

```bash
psql -U postgres -d story_website -f backend/database/schema.sql
```

### Step 3: Install Backend Dependencies

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=story_website
DB_USER=postgres
DB_PASSWORD=your_password
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-secret-key
```

Start backend:
```bash
npm start
```

### Step 4: Install Frontend Dependencies

```bash
cd frontend
npm install
```

Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm run dev
```

### Step 5: Visit the Website

Open [http://localhost:3000](http://localhost:3000)

## First Steps

1. **Create Account**: Click "Login" → "Sign up"
2. **Create Story**: Click "+ Create Story"
3. **Explore**: Browse, read, and interact with stories

## Troubleshooting

### Database Connection Error

```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT version();"
```

### Redis Connection Error

```bash
# Check Redis is running
redis-cli ping
# Should return: PONG
```

### Port Already in Use

```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill
```

## What's Next?

- Read the full [Setup Guide](SETUP.md)
- Check out [Features](README.md#features)
- Explore the [API Documentation](README.md#api-endpoints)

## Need Help?

- Check [SETUP.md](SETUP.md) for detailed instructions
- Review error messages in terminal
- Check browser console for frontend errors
