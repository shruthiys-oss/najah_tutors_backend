import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Najah Tutors Backend API',
      version: '1.0.0',
      description: 'API documentation for Najah Tutors platform - A comprehensive tutoring management system',
      contact: {
        name: 'Najah Tutors Development Team',
        email: 'dev@najahtutors.com',
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api.najahtutors.com',
        description: 'Production server',
      },
    ],
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
      {
        name: 'Hello',
        description: 'Example endpoints',
      },
      {
        name: 'Cache',
        description: 'Cache management endpoints',
      },
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
          },
        },
        HealthCheck: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'OK',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
            uptime: {
              type: 'number',
              description: 'Server uptime in seconds',
            },
            services: {
              type: 'object',
              properties: {
                mongodb: {
                  type: 'string',
                  enum: ['connected', 'disconnected'],
                },
                redis: {
                  type: 'string',
                  enum: ['connected', 'disconnected'],
                },
              },
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'], // Path to API docs
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
