import redisClient from '../config/redis.js';
import { logger } from '../utils/logger.js';

/**
 * Cache middleware for GET requests
 * Caches responses in Redis for faster subsequent requests
 */
export const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    try {
      const key = `cache:${req.originalUrl || req.url}`;
      const cachedData = await redisClient.get(key);

      if (cachedData) {
        logger.info(`Cache hit for: ${key}`);
        return res.json(cachedData);
      }

      // Store original res.json function
      const originalJson = res.json.bind(res);

      // Override res.json to cache the response
      res.json = (body) => {
        // Cache the response
        redisClient.set(key, body, duration).catch((err) => {
          logger.error('Failed to cache response:', err);
        });

        // Call original json function
        return originalJson(body);
      };

      next();
    } catch (error) {
      logger.error('Cache middleware error:', error);
      next();
    }
  };
};

/**
 * Clear cache for specific patterns
 */
export const clearCache = async (pattern = '*') => {
  try {
    const deletedCount = await redisClient.deletePattern(`cache:${pattern}`);
    logger.info(`Cleared ${deletedCount} cache entries matching pattern: ${pattern}`);
    return deletedCount;
  } catch (error) {
    logger.error('Failed to clear cache:', error);
    return 0;
  }
};
