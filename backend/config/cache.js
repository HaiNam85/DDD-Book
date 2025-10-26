const redis = require('../database/redis');

// Check if Redis caching is enabled
const ENABLE_REDIS = process.env.ENABLE_REDIS !== 'false';

class CacheService {
  constructor() {
    // Check if Redis is actually available
    if (ENABLE_REDIS && redis) {
      this.enabled = true;
      this.client = redis;
    } else {
      this.enabled = false;
      this.client = null;
    }
    
    if (this.enabled) {
      this.checkConnection();
    }
  }

  async checkConnection() {
    if (!this.client) {
      this.enabled = false;
      return;
    }
    
    try {
      if (this.client.isOpen) {
        await this.client.ping();
      }
    } catch (error) {
      console.warn('Redis connection check failed:', error.message);
      this.enabled = false;
      this.client = null;
    }
  }

  // Get value from cache
  async get(key) {
    if (!this.enabled || !this.client) return null;
    
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache GET error:', error);
      return null;
    }
  }

  // Set value in cache
  async set(key, value, ttl = 3600) {
    if (!this.enabled || !this.client) return;
    
    try {
      await this.client.setEx(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Cache SET error:', error);
    }
  }

  // Delete key from cache
  async del(key) {
    if (!this.enabled || !this.client) return;
    
    try {
      await this.client.del(key);
    } catch (error) {
      console.error('Cache DEL error:', error);
    }
  }

  // Clear cache (supports wildcards)
  async clear(pattern) {
    if (!this.enabled || !this.client) return;
    
    try {
      // Note: Redis doesn't support wildcards in DEL
      // This is a simplified version
      // For production, consider using SCAN + DELETE for pattern matching
      if (pattern.endsWith('*')) {
        const prefix = pattern.slice(0, -1);
        const keys = await this.client.keys(`${prefix}*`);
        if (keys.length > 0) {
          await this.client.del(keys);
        }
      } else {
        await this.client.del(pattern);
      }
    } catch (error) {
      console.error('Cache CLEAR error:', error);
    }
  }

  isEnabled() {
    return this.enabled;
  }
}

// Export singleton instance
const cache = new CacheService();

module.exports = cache;
