# Najah Tutors Backend

Backend service for **Najah Tutors** platform, built with Node.js 24.x, Express 5.1, MongoDB (Mongoose 8.7), and Redis 7.x for caching, session management, OTP handling, and rate limiting.

## 🚀 Technology Stack

### Backend
- **Node.js:** v24.x.x
- **Express.js:** v5.1.0
- **Mongoose:** v8.7.x (MongoDB ODM)

### Caching & Session Management
- **Redis:** 7.x
- **Amazon ElastiCache Redis:** 7.x (Production)
- Used for:
  - Response caching
  - Session management
  - OTP storage and verification
  - API rate limiting

### Containerization
- **Docker Engine:** 24.x
- **Docker Compose:** v2.x

## ✨ Features

* **Express 5.1 Server** with modern middleware
* **MongoDB Integration** via Mongoose 8.7
* **Redis Integration** for caching and sessions
* **Rate Limiting** with Redis-backed store
* **OTP Generation & Verification** with Redis storage
* **API Response Caching** middleware
* **CORS Enabled** with configurable origins
* **Health Check Endpoint** for monitoring
* **Graceful Shutdown** handling
* **ES Modules** (modern JavaScript)
* **Environment-based Configuration**
* **Linting & Formatting** (ESLint + Prettier)
* **Testing** setup with Jest
* **Docker & Docker Compose** ready
* **Structured & Scalable** folder organization

## 📋 Prerequisites

* **Node.js v24.x.x** (use nvm: `nvm install 24` and `nvm use 24`)
* **npm** (comes with Node.js)
* **MongoDB** (local or remote)
* **Redis** (local or AWS ElastiCache)
* **Docker** & **Docker Compose** (for containerization)

## 🔧 Installation

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   cd najah_tutors_backend
   ```

2. **Use Node.js v24:**

   ```bash
   nvm use
   # or
   nvm install 24
   nvm use 24
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

## ⚙️ Environment Variables

1. **Create `.env` file from example:**

   ```bash
   cp .env.example .env
   ```

2. **Configure your `.env` file:**

   ```env
   # Server
   NODE_ENV=development
   PORT=3000

   # Database
   MONGODB_URI=mongodb://localhost:27017/najah_tutors

   # Redis (Local)
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=redis_password

   # Redis (AWS ElastiCache - Production)
   # REDIS_HOST=your-elasticache-endpoint.cache.amazonaws.com
   # REDIS_PORT=6379
   # REDIS_PASSWORD=your-secure-password

   # Session
   SESSION_SECRET=your-super-secret-session-key
   SESSION_MAX_AGE=86400000

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100

   # OTP
   OTP_EXPIRY_MINUTES=10
   OTP_LENGTH=6

   # CORS
   CORS_ORIGIN=http://localhost:3000,http://localhost:5173
   ```

## 🏃 Running the Application

### Local Development

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

### With Docker Compose

```bash
# Start all services (backend + MongoDB + Redis)
npm run docker:compose:up

# View logs
npm run docker:compose:logs

# Stop all services
npm run docker:compose:down
```

### Individual Docker Commands

```bash
# Build Docker image
npm run docker:build

# Run container
npm run docker:run

# Run in development mode
npm run docker:run-dev
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

Coverage reports will be in the `coverage/` directory.

## 🎨 Linting & Formatting

```bash
# Check for linting errors
npm run lint

# Fix linting errors automatically
npm run lint -- --fix
```

## 📚 API Documentation

### Swagger UI
Interactive API documentation is available at:
```
http://localhost:3000/api-docs
```

### Swagger JSON
OpenAPI specification JSON:
```
http://localhost:3000/api-docs.json
```

The Swagger documentation provides:
- Complete API endpoint descriptions
- Request/response schemas
- Interactive testing interface
- Example requests and responses

## 📡 API Endpoints

### Health Check
```
GET /health
```
Returns server health status including MongoDB and Redis connection states.

### Root
```
GET /
```
Welcome message with API version info.

### Hello Example
```
GET /api/hello
```
Example endpoint demonstrating Redis-backed visit counter.

### Cache Management

**Get Cache Stats:**
```
GET /api/cache/stats
```

**Clear Cache by Pattern:**
```
DELETE /api/cache/clear?pattern=*
```

**Test Cache:**
```
POST /api/cache/test
Body: { "key": "testKey", "value": "testValue", "expiry": 300 }
```

## 🏗️ Project Structure

```
najah_tutors_backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── redis.js             # Redis client singleton
│   ├── controllers/
│   │   ├── hello.controller.js  # Example controller
│   │   ├── otp.controller.js    # OTP management
│   │   └── cache.controller.js  # Cache operations
│   ├── middlewares/
│   │   ├── hello.middleware.js
│   │   ├── rateLimiter.middleware.js  # Redis-backed rate limiting
│   │   └── cache.middleware.js        # Response caching
│   ├── routes/
│   │   ├── index.js            # Route aggregator
│   │   ├── hello.route.js
│   │   ├── otp.route.js
│   │   └── cache.route.js
│   ├── tests/
│   │   └── hello.test.js
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   ├── redis.js             # Redis client singleton
│   │   └── swagger.js           # Swagger/OpenAPI configuration
│   ├── controllers/
│   │   ├── hello.controller.js  # Example controller
│   │   └── cache.controller.js  # Cache operations
│   ├── middlewares/
│   │   ├── hello.middleware.js
│   │   ├── rateLimiter.middleware.js  # Redis-backed rate limiting
│   │   └── cache.middleware.js        # Response caching
│   ├── routes/
│   │   ├── index.js            # Route aggregator
│   │   ├── hello.route.js
│   │   └── cache.route.js
│   ├── tests/
│   │   └── hello.test.js
│   ├── utils/
│   │   └── logger.js           # Logging utility
│   └── index.js                # Application entry point
├── public/
│   └── config.json
├── .env.example                # Environment variables template
├── .nvmrc                      # Node version specification
├── Dockerfile                  # Docker image definition
├── docker-compose.yml          # Multi-container setup
├── package.json
├── jest.config.js
└── README.md
```

## 🔐 Security Features

- **Rate Limiting:** Redis-backed rate limiting on all API endpoints
- **CORS:** Configurable Cross-Origin Resource Sharing
- **Environment Variables:** Sensitive data stored securely
- **Graceful Shutdown:** Proper cleanup of connections
- **Input Validation:** Request validation on all endpoints

## 🌐 AWS ElastiCache Integration

For production deployment with AWS ElastiCache Redis:

1. **Create ElastiCache Redis Cluster** (Redis 7.x)
2. **Configure Security Groups** to allow backend access
3. **Update `.env` file:**
   ```env
   REDIS_HOST=your-cluster.cache.amazonaws.com
   REDIS_PORT=6379
   REDIS_PASSWORD=your-password
   ```

## 📊 Monitoring

The application includes a health check endpoint at `/health` that returns:
- Server status
- MongoDB connection state
- Redis connection state
- Server uptime

Integrate this with monitoring tools like:
- AWS CloudWatch
- DataDog
- New Relic
- Prometheus + Grafana

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

ISC

## 👥 Authors

Najah Tutors Development Team

---

**Note:** This backend is designed to work with the Flutter 3.35.0 frontend application.
  npm run docker:build
  # or directly: docker build -t najah_tutors_backend .
  ```

  This will build a Docker image named `najah_tutors_backend` based on the .
* **Run the Docker Container (detached mode):**

  ```bash
  npm run docker:run
  # or directly: docker run -p 3000:3000 -d najah_tutors_backend
  ```

  This will run the built image as a detached container, mapping port 3000 from the container to your host.
* **Run the Docker Container (development mode - with volume mount):**

  ```bash
  npm run docker:run-dev
  # or directly: docker run -p 3000:3000 -it --rm -v $(pwd):/app najah_tutors_backend
  ```

  This runs the container in interactive mode, removes it after exit, and mounts your current working directory into the container's  directory. This is useful for development as changes on your host will reflect inside the container without rebuilding the image.

## Project Structure

```
.
├── node_modules/     # Dependencies
├── public/           # Static assets or configuration files
│   └── config.json   # Example public config (used by logger)
├── src/              # Source code
│   ├── config/       # Environment, database config
│   │   └── database.js
│   ├── controllers/  # Request handlers
│   │   └── hello.controller.js
│   ├── middlewares/  # Express middlewares
│   │   └── hello.middleware.js
│   ├── models/       # Mongoose models (if any)
│   ├── routes/       # API route definitions
│   │   ├── index.js        # Main API router
│   │   └── hello.route.js  # Example route file
│   ├── services/     # Business logic (optional separation)
│   ├── socket/       # WebSocket logic (if any)
│   ├── tests/        # Test files (Jest)
│   │   └── hello.test.js
│   ├── utils/        # Utility functions
│   │   └── logger.js
│   ├── webhooks/     # Webhook handlers (if any)
│   └── index.js      # Application entry point
├── .env              # Local environment variables (DO NOT COMMIT)
├── .env.example      # Example environment variables
├── .eslintrc.json    # ESLint configuration
├── .gitignore        # Git ignore rules
├── .prettierrc       # Prettier configuration
├── .dockerignore     # Files to ignore when building Docker image
├── Dockerfile        # Docker build instructions
├── jest.config.js    # Jest configuration
├── package.json      # Project manifest
├── package-lock.json # Dependency lock file
└── README.md         # This file
```

## Contributing

Contributions are welcome! Please follow standard Git workflow (fork, branch, commit, pull request). Ensure tests pass and linting rules are followed.



## Note

Please test your changes in the staging branch before pushing for production,avoid merging it to main branch before testing as it is reserved for production.

## License

(Add your license information here, e.g., MIT)

# najah_tutors_backend
