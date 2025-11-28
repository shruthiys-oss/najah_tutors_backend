import redisClient from '../config/redis.js';
import { logger } from '../utils/logger.js';

/**
 * Get cache statistics
 * GET /api/cache/stats
 */
export const getCacheStats = async (req, res) => {
  try {
    const client = redisClient.getClient();
    const info = await client.info('stats');
    
    res.json({
      success: true,
      data: {
        connected: redisClient.isConnected,
        info: info,
      },
    });
  } catch (error) {
    logger.error('Get cache stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get cache statistics',
    });
  }
};

/**
 * Clear cache by pattern
 * DELETE /api/cache/clear
 */
export const clearCacheByPattern = async (req, res) => {
  try {
    const { pattern } = req.query;
    
    if (!pattern) {
      return res.status(400).json({
        success: false,
        message: 'Pattern is required',
      });
    }

    const deletedCount = await redisClient.deletePattern(`cache:${pattern}`);
    
    res.json({
      success: true,
      message: `Cleared ${deletedCount} cache entries`,
      data: { deletedCount },
    });
  } catch (error) {
    logger.error('Clear cache error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cache',
    });
  }
};

/**
 * Test cache with a simple key-value operation
 * POST /api/cache/test
 */
export const testCache = async (req, res) => {
  try {
    const { key, value, expiry } = req.body;
    
    if (!key || !value) {
      return res.status(400).json({
        success: false,
        message: 'Key and value are required',
      });
    }

    // Set cache
    await redisClient.set(`test:${key}`, value, expiry || 300);
    
    // Get cache
    const cachedValue = await redisClient.get(`test:${key}`);
    
    res.json({
      success: true,
      message: 'Cache test successful',
      data: {
        original: value,
        cached: cachedValue,
        match: JSON.stringify(value) === JSON.stringify(cachedValue),
      },
    });
  } catch (error) {
    logger.error('Test cache error:', error);
    res.status(500).json({
      success: false,
      message: 'Cache test failed',
    });
  }
};
