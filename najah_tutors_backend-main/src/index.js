import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import swaggerUi from 'swagger-ui-express';
import { beyonderLogger } from "./utils/logger.js";
import apiRoutes from "./routes/index.js";
import { connectDB } from "./config/database.js";
import redisClient from "./config/redis.js";
import { generalLimiter } from "./middlewares/rateLimiter.middleware.js";
import swaggerSpec from "./config/swagger.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- Essential Middlewares ---
// Enable CORS (configure specific origins in production)
const corsOptions = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  credentials: true,
};
app.use(cors(corsOptions));

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to all routes (can be customized per route)
app.use(generalLimiter);

// --- Swagger API Documentation ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Najah Tutors API Docs',
}));

// Swagger JSON endpoint
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// --- Health Check Endpoint ---
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     description: Returns the health status of the server and connected services
 *     responses:
 *       200:
 *         description: All services are healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheck'
 *       503:
 *         description: One or more services are unavailable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheck'
 */
app.get("/health", async (req, res) => {
  const health = {
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      redis: redisClient.isConnected ? "connected" : "disconnected",
    }
  };
  
  const httpCode = health.services.mongodb === "connected" ? 200 : 503;
  res.status(httpCode).json(health);
});

// --- Root Endpoint ---
/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome endpoint
 *     tags: [Health]
 *     description: Returns welcome message and API version information
 *     responses:
 *       200:
 *         description: Welcome message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Welcome to Najah Tutors Backend API! ✨
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                 node:
 *                   type: string
 *                   example: v24.0.0
 */
app.get("/", (req, res) => {
  res.json({ 
    message: "Welcome to Najah Tutors Backend API! ✨",
    version: "1.0.0",
    node: process.version,
  });
});

// --- API Routes ---
app.use("/api", apiRoutes);

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error("❌ Unhandled Error:", err.stack || err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
});

// --- Graceful Shutdown ---
const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  try {
    // Close Redis connection
    await redisClient.disconnect();
    
    // Close MongoDB connection
    await mongoose.connection.close();
    
    console.log("✅ All connections closed. Exiting...");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// --- Connect Services and Start Server ---
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log("✅ MongoDB connected");
    
    // Connect to Redis (optional - will use fallback if unavailable)
    try {
      await redisClient.connect();
      console.log("✅ Redis connected");
    } catch (redisError) {
      console.warn("⚠️  Redis connection failed - using memory-based fallback");
      console.warn("   Start Redis with: docker-compose up -d redis");
    }
    
    // Start Express server
    app.listen(PORT, async () => {
      await beyonderLogger();
      console.log(`✅ Server listening on http://localhost:${PORT}`);
      console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   Node Version: ${process.version}`);
      console.log(`   MongoDB URI: ${process.env.MONGODB_URI || process.env.MONGO_URI}`);
      console.log(`   Redis: ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

