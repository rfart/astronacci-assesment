import swaggerJSDoc from 'swagger-jsdoc';
import { SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Social Media Platform API',
    version: '1.0.0',
    description: 'A comprehensive social media platform API with membership tiers, authentication, and content management',
    contact: {
      name: 'API Support',
      email: 'support@astronacci.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'http://localhost:5001/api',
      description: 'Development server'
    },
    {
      url: 'https://api.yourdomain.com',
      description: 'Production server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      User: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          _id: {
            type: 'string',
            description: 'User ID'
          },
          name: {
            type: 'string',
            description: 'User full name'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address'
          },
          avatar: {
            type: 'string',
            description: 'User avatar URL'
          },
          membershipType: {
            type: 'string',
            enum: ['TYPE_A', 'TYPE_B', 'TYPE_C'],
            description: 'Membership tier'
          },
          role: {
            type: 'string',
            enum: ['user', 'editor', 'admin'],
            description: 'User role'
          },
          isActive: {
            type: 'boolean',
            description: 'Account status'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Account creation date'
          }
        }
      },
      Article: {
        type: 'object',
        required: ['title', 'content', 'author'],
        properties: {
          _id: {
            type: 'string',
            description: 'Article ID'
          },
          title: {
            type: 'string',
            description: 'Article title'
          },
          content: {
            type: 'string',
            description: 'Article content'
          },
          excerpt: {
            type: 'string',
            description: 'Article excerpt'
          },
          slug: {
            type: 'string',
            description: 'Article URL slug'
          },
          author: {
            type: 'string',
            description: 'Author ID'
          },
          category: {
            type: 'string',
            description: 'Category ID'
          },
          tags: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Article tags'
          },
          featuredImage: {
            type: 'string',
            description: 'Featured image URL'
          },
          isPublished: {
            type: 'boolean',
            description: 'Publication status'
          },
          viewCount: {
            type: 'number',
            description: 'View count'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation date'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update date'
          }
        }
      },
      Video: {
        type: 'object',
        required: ['title', 'url', 'author'],
        properties: {
          _id: {
            type: 'string',
            description: 'Video ID'
          },
          title: {
            type: 'string',
            description: 'Video title'
          },
          description: {
            type: 'string',
            description: 'Video description'
          },
          url: {
            type: 'string',
            description: 'Video URL'
          },
          thumbnail: {
            type: 'string',
            description: 'Thumbnail URL'
          },
          author: {
            type: 'string',
            description: 'Author ID'
          },
          category: {
            type: 'string',
            description: 'Category ID'
          },
          duration: {
            type: 'number',
            description: 'Duration in seconds'
          },
          tags: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Video tags'
          },
          isPublished: {
            type: 'boolean',
            description: 'Publication status'
          },
          viewCount: {
            type: 'number',
            description: 'View count'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation date'
          }
        }
      },
      Category: {
        type: 'object',
        required: ['name', 'slug'],
        properties: {
          _id: {
            type: 'string',
            description: 'Category ID'
          },
          name: {
            type: 'string',
            description: 'Category name'
          },
          description: {
            type: 'string',
            description: 'Category description'
          },
          slug: {
            type: 'string',
            description: 'Category URL slug'
          },
          color: {
            type: 'string',
            description: 'Category color'
          },
          isActive: {
            type: 'boolean',
            description: 'Category status'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation date'
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false
          },
          message: {
            type: 'string',
            description: 'Error message'
          },
          error: {
            type: 'string',
            description: 'Detailed error information'
          }
        }
      },
      Success: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          message: {
            type: 'string',
            description: 'Success message'
          },
          data: {
            type: 'object',
            description: 'Response data'
          }
        }
      },
      PaginatedResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true
          },
          data: {
            type: 'array',
            items: {
              type: 'object'
            }
          },
          pagination: {
            type: 'object',
            properties: {
              currentPage: {
                type: 'number'
              },
              totalPages: {
                type: 'number'
              },
              totalItems: {
                type: 'number'
              },
              hasNext: {
                type: 'boolean'
              },
              hasPrev: {
                type: 'boolean'
              }
            }
          }
        }
      }
    }
  },
  tags: [
    {
      name: 'Health',
      description: 'Health check endpoints'
    },
    {
      name: 'Authentication',
      description: 'User authentication and authorization'
    },
    {
      name: 'Users',
      description: 'User management operations'
    },
    {
      name: 'Articles',
      description: 'Article management operations'
    },
    {
      name: 'Videos',
      description: 'Video management operations'
    },
    {
      name: 'Categories',
      description: 'Category management operations'
    },
    {
      name: 'CMS',
      description: 'Content Management System operations'
    }
  ]
};

const options = {
  definition: swaggerDefinition,
  apis: [
    './src/routes/*.ts',
    './src/index.ts'
  ]
};

export const swaggerSpec = swaggerJSDoc(options);
