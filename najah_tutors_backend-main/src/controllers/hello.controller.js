import redisClient from '../config/redis.js';

/**
 * @desc    Handles the GET /api/hello request
 * @param   {import('express').Request} req Express request object
 * @param   {import('express').Response} res Express response object
 */
export const helloController = async (req, res) => {
  try {
    // Access data potentially added by middleware
    const middlewareMessage = req.middlewareMessage || "Middleware ran successfully!";

    // Demonstrate Redis integration
    const visitKey = 'hello:visit_count';
    let visitCount = await redisClient.get(visitKey);
    
    if (!visitCount) {
      visitCount = 0;
    }
    
    visitCount++;
    await redisClient.set(visitKey, visitCount);

    console.log("✅ Hello Controller executed");
    res.status(200).json({
      message: "Hello from Najah Tutors Backend API! ⚡",
      note: middlewareMessage,
      visitCount: visitCount,
      timestamp: new Date().toISOString(),
      versions: {
        node: process.version,
        express: "5.1.0",
        mongoose: "8.7.x",
        redis: "7.x"
      }
    });
  } catch (error) {
    console.error("❌ Hello Controller error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
