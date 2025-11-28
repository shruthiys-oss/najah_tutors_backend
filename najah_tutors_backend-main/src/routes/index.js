import express from "express";
import helloRouter from "./hello.route.js";
import cacheRouter from "./cache.route.js";

const router = express.Router();

// Mount the routers
router.use("/hello", helloRouter);
router.use("/cache", cacheRouter);

export default router;
