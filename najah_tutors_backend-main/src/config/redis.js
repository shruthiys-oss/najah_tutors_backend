import { createClient } from 'redis';
import { logger } from '../utils/logger.js';

class RedisClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      const redisConfig = {
        socket: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT) || 6379,
          reconnectStrategy: (retries) => {
            if (retries > 10) {
              logger.error('Redis reconnection failed after 10 attempts');
              return new Error('Redis reconnection limit exceeded');
            }
            return Math.min(retries * 100, 3000);
          },
        },
      };

      // Add password if provided
      if (process.env.REDIS_PASSWORD) {
        redisConfig.password = process.env.REDIS_PASSWORD;
      }

      this.client = createClient(redisConfig);

      // Error handling
      this.client.on('error', (err) => {
        logger.error('Redis Client Error:', err);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        logger.info('Redis client connecting...');
      });

      this.client.on('ready', () => {
        logger.info('Redis client connected and ready');
        this.isConnected = true;
      });

      this.client.on('reconnecting', () => {
        logger.warn('Redis client reconnecting...');
        this.isConnected = false;
      });

      this.client.on('end', () => {
        logger.warn('Redis client connection closed');
        this.isConnected = false;
      });

      await this.client.connect();
      return this.client;
    } catch (error) {
      logger.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.quit();
      this.isConnected = false;
      logger.info('Redis client disconnected');
    }
  }

  getClient() {
    if (!this.client || !this.isConnected) {
      throw new Error('Redis client is not connected');
    }
    return this.client;
  }

  // Cache methods
  async set(key, value, expiryInSeconds = null) {
    try {
      const serializedValue = JSON.stringify(value);
      if (expiryInSeconds) {
        await this.client.setEx(key, expiryInSeconds, serializedValue);
      } else {
        await this.client.set(key, serializedValue);
      }
      return true;
    } catch (error) {
      logger.error(`Redis SET error for key ${key}:`, error);
      return false;
    }
  }

  async get(key) {
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error(`Redis GET error for key ${key}:`, error);
      return null;
    }
  }

  async delete(key) {
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      logger.error(`Redis DELETE error for key ${key}:`, error);
      return false;
    }
  }

  async exists(key) {
    try {
      const exists = await this.client.exists(key);
      return exists === 1;
    } catch (error) {
      logger.error(`Redis EXISTS error for key ${key}:`, error);
      return false;
    }
  }

  // OTP specific methods
  async setOTP(identifier, otp, expiryMinutes = 10) {
    const key = `otp:${identifier}`;
    const expirySeconds = expiryMinutes * 60;
    return await this.set(key, { otp, createdAt: Date.now() }, expirySeconds);
  }

  async getOTP(identifier) {
    const key = `otp:${identifier}`;
    return await this.get(key);
  }

  async deleteOTP(identifier) {
    const key = `otp:${identifier}`;
    return await this.delete(key);
  }

  // Session methods
  async setSession(sessionId, sessionData, expirySeconds = 86400) {
    const key = `session:${sessionId}`;
    return await this.set(key, sessionData, expirySeconds);
  }

  async getSession(sessionId) {
    const key = `session:${sessionId}`;
    return await this.get(key);
  }

  async deleteSession(sessionId) {
    const key = `session:${sessionId}`;
    return await this.delete(key);
  }

  // Pattern-based operations
  async deletePattern(pattern) {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
      return keys.length;
    } catch (error) {
      logger.error(`Redis DELETE PATTERN error for pattern ${pattern}:`, error);
      return 0;
    }
  }

  // Clear all cache (use with caution)
  async flushAll() {
    try {
      await this.client.flushAll();
      logger.warn('Redis cache flushed - all data cleared');
      return true;
    } catch (error) {
      logger.error('Redis FLUSH ALL error:', error);
      return false;
    }
  }
}

// Export singleton instance
const redisClient = new RedisClient();
export default redisClient;
