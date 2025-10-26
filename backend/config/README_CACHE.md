# Redis Caching Configuration

This document explains how to enable or disable Redis caching in the application.

## Overview

The application uses Redis for caching story data to improve performance. However, Redis is optional and you can run the application without it.

## Configuration

### Enable Redis (Default)

By default, Redis caching is **enabled**. To use it, you need to:

1. Install Redis on your system
2. Make sure Redis is running
3. Configure your `.env` file:

```env
ENABLE_REDIS=true
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

### Disable Redis

If you don't want to use Redis caching, you can disable it:

**Option 1: Set environment variable**

```env
ENABLE_REDIS=false
```

**Option 2: Don't set ENABLE_REDIS**

If `ENABLE_REDIS` is not set to `true`, caching will be disabled.

## How It Works

### When Redis is Enabled (ENABLE_REDIS=true)

- Story data is cached for 1 hour
- Cache is automatically cleared when stories are updated or deleted
- Faster response times for frequently accessed stories
- Reduced database load

### When Redis is Disabled (ENABLE_REDIS=false)

- All data is fetched directly from PostgreSQL
- No caching overhead
- Simpler setup (no Redis required)
- Slightly slower for high-traffic scenarios

## Installation

### Windows

```bash
# Download Redis from: https://github.com/microsoftarchive/redis/releases
# Or use Chocolatey:
choco install redis-64
```

### macOS

```bash
brew install redis
brew services start redis
```

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
```

## Verification

### Check if Redis is running

```bash
redis-cli ping
# Should return: PONG
```

### Check application status

When you start the backend server, you'll see:

**If Redis is enabled:**
```
✅ Redis caching: ENABLED
```

**If Redis is disabled:**
```
⚠️  Redis caching: DISABLED
   Set ENABLE_REDIS=true in .env to enable caching
```

## Cache Keys

The application uses the following cache key patterns:

- `story:{id}` - Cached story data
- `stories:*` - Story listings (wildcard pattern)

## Performance Impact

### With Redis (ENABLE_REDIS=true)

- **First request**: Queries database (slower)
- **Subsequent requests**: Returns from cache (fast, <1ms)
- **TTL**: 1 hour (3600 seconds)

### Without Redis (ENABLE_REDIS=false)

- **Every request**: Queries database (consistent speed)
- No caching overhead
- More database queries

## Troubleshooting

### Redis connection errors

If you see Redis connection errors but don't want to use Redis:

1. Set `ENABLE_REDIS=false` in your `.env` file
2. Restart the backend server

### Application won't start without Redis

The application is designed to work without Redis. If it fails to start:

1. Check that `ENABLE_REDIS` is set correctly
2. Verify your PostgreSQL connection is working
3. Check server logs for specific errors

## Development vs Production

### Development

You can disable Redis for development to avoid setup complexity:

```env
ENABLE_REDIS=false
```

### Production

For production environments, Redis is highly recommended:

```env
ENABLE_REDIS=true
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-secure-password
```

## Cache Service API

The cache service is available in `/backend/config/cache.js` and provides these methods:

```javascript
const cache = require('../config/cache');

// Get value from cache
const value = await cache.get('key');

// Set value in cache (TTL in seconds)
await cache.set('key', value, 3600);

// Delete a key
await cache.del('key');

// Clear cache with wildcard pattern
await cache.clear('stories:*');

// Check if caching is enabled
const isEnabled = cache.isEnabled();
```

## Summary

- **Default**: Redis is enabled
- **To disable**: Set `ENABLE_REDIS=false` in `.env`
- **Application works fine without Redis**: Just slower for high-traffic
- **Production**: Recommended to use Redis for better performance
