import express from "express";
import { helloMiddleware } from "../middlewares/hello.middleware.js";
import { helloController } from "../controllers/hello.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/hello:
 *   get:
 *     summary: Hello endpoint
 *     tags: [Hello]
 *     description: Returns a hello message with visit count (Redis-backed counter)
 *     responses:
 *       200:
 *         description: Success response with hello message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello from Najah Tutors Backend API! ⚡
 *                 note:
 *                   type: string
 *                   example: Middleware ran successfully!
 *                 visitCount:
 *                   type: number
 *                   example: 42
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 versions:
 *                   type: object
 *                   properties:
 *                     node:
 *                       type: string
 *                     express:
 *                       type: string
 *                     mongoose:
 *                       type: string
 *                     redis:
 *                       type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", helloMiddleware, helloController);

export default router;
