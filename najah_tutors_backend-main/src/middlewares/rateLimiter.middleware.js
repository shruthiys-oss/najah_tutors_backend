import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redisClient from '../config/redis.js';
import { logger } from '../utils/logger.js';

/**
 * Rate limiting middleware using Redis
 * This prevents abuse and ensures fair usage of the API
 */
export const createRateLimiter = (options = {}) => {
  const {
    windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message = 'Too many requests from this IP, please try again later.',
    standardHeaders = true,
    legacyHeaders = false,
  } = options;

  try {
    // Check if Redis is connected before trying to use it
    if (!redisClient.isConnected) {
      throw new Error('Redis client is not connected');
    }
    const client = redisClient.getClient();

    return rateLimit({
      store: new RedisStore({
        // @ts-expect-error - Known issue with TypeScript types
        client: client,
        prefix: 'rl:', // rate limit prefix
      }),
      windowMs,
      max,
      message,
      standardHeaders,
      legacyHeaders,
      handler: (req, res) => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
          success: false,
          message,
        });
      },
    });
  } catch (error) {
    logger.error('Failed to create rate limiter with Redis:', error);
    
    // Fallback to memory-based rate limiting if Redis is not available
    logger.warn('Using memory-based rate limiting as fallback');
    return rateLimit({
      windowMs,
      max,
      message,
      standardHeaders,
      legacyHeaders,
    });
  }
};

// Pre-configured rate limiters for different endpoints
// These will be initialized lazily when first used
let _generalLimiter;
let _strictLimiter;
let _authLimiter;
let _otpLimiter;

export const generalLimiter = (req, res, next) => {
  if (!_generalLimiter) {
    _generalLimiter = createRateLimiter({
      windowMs: 15 * 60 * 1000,
      max: 100,
    });
  }
  return _generalLimiter(req, res, next);
};

export const strictLimiter = (req, res, next) => {
  if (!_strictLimiter) {
    _strictLimiter = createRateLimiter({
      windowMs: 15 * 60 * 1000,
      max: 20,
      message: 'Too many requests, please slow down.',
    });
  }
  return _strictLimiter(req, res, next);
};

export const authLimiter = (req, res, next) => {
  if (!_authLimiter) {
    _authLimiter = createRateLimiter({
      windowMs: 15 * 60 * 1000,
      max: 5,
      message: 'Too many authentication attempts, please try again later.',
    });
  }
  return _authLimiter(req, res, next);
};

export const otpLimiter = (req, res, next) => {
  if (!_otpLimiter) {
    _otpLimiter = createRateLimiter({
      windowMs: 60 * 60 * 1000,
      max: 3,
      message: 'Too many OTP requests, please try again later.',
    });
  }
  return _otpLimiter(req, res, next);
};
