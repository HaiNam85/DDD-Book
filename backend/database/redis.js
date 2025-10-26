const redis = require('redis');
require('dotenv').config();

// Check if Redis is enabled
const ENABLE_REDIS = process.env.ENABLE_REDIS !== 'false';

let client = null;

if (ENABLE_REDIS) {
  client = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
  });

  client.on('error', (err) => {
    console.error('Redis error:', err.message);
  });

  // Connect to Redis
  client.connect().catch((err) => {
    console.error('Failed to connect to Redis:', err.message);
  });
}

module.exports = client;
