import express from 'express';
import { getCacheStats, clearCacheByPattern, testCache } from '../controllers/cache.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/cache/stats:
 *   get:
 *     summary: Get cache statistics
 *     tags: [Cache]
 *     description: Returns Redis cache statistics and connection information
 *     responses:
 *       200:
 *         description: Cache statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     connected:
 *                       type: boolean
 *                     info:
 *                       type: string
 *       500:
 *         description: Failed to get cache statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/stats', getCacheStats);

/**
 * @swagger
 * /api/cache/clear:
 *   delete:
 *     summary: Clear cache by pattern
 *     tags: [Cache]
 *     description: Deletes cache entries matching the specified pattern
 *     parameters:
 *       - in: query
 *         name: pattern
 *         required: true
 *         schema:
 *           type: string
 *         description: Pattern to match cache keys (e.g., "*" for all)
 *         example: "*"
 *     responses:
 *       200:
 *         description: Cache cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     deletedCount:
 *                       type: number
 *       400:
 *         description: Pattern parameter is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Failed to clear cache
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/clear', clearCacheByPattern);

/**
 * @swagger
 * /api/cache/test:
 *   post:
 *     summary: Test cache functionality
 *     tags: [Cache]
 *     description: Tests Redis cache by storing and retrieving a value
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - key
 *               - value
 *             properties:
 *               key:
 *                 type: string
 *                 description: Cache key
 *                 example: testKey
 *               value:
 *                 description: Value to cache (can be any type)
 *                 example: { "data": "test value" }
 *               expiry:
 *                 type: number
 *                 description: Expiry time in seconds
 *                 example: 300
 *     responses:
 *       200:
 *         description: Cache test successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     original:
 *                       description: Original value
 *                     cached:
 *                       description: Cached value retrieved
 *                     match:
 *                       type: boolean
 *       400:
 *         description: Key and value are required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Cache test failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/test', testCache);

export default router;
