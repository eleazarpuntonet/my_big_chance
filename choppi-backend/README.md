# Choppi Backend (NestJS)

Backend API for the Choppi full-stack application built with NestJS, TypeORM, and PostgreSQL.

## Status
✅ **Completed**: Backend fully implemented with all required APIs, authentication, and database seeding. Ready for production deployment.

## Features

- **Authentication**: JWT-based authentication with login/register
- **Stores Management**: CRUD operations for stores with pagination and search
- **Products Catalog**: Global product management
- **Store Products**: Per-store product inventory with pricing and stock
- **Cart Calculation**: Optional cart quote endpoint
- **Swagger Documentation**: Complete API documentation at `/api`
- **Database Seeding**: Sample data for development

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Passport
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest

## Installation

```bash
# Install dependencies
npm install
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_DATABASE=your_db_name

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key

# Application Configuration
NODE_ENV=development
PORT=3000
```

## Database Setup

### From Scratch (Recommended)
If working with Docker images from scratch:

1. **Build and start services**:
```bash
# From project root
docker compose up --build
```

2. **Database structure creation**:
   - **Development**: TypeORM synchronizes tables automatically
   - **Production**: Migrations run automatically in container

3. **Populate with sample data**:
```bash
# Access backend container
docker compose exec choppi-backend bash

# Run seed script
npm run seed
```

This creates:
- 3 sample stores
- 20 sample products
- Store-product associations with randomized pricing/stock

### Local Development
For local development without Docker:

1. **Ensure PostgreSQL is running locally**
2. **Install dependencies**: `npm install`
3. **Configure .env** with local database credentials
4. **Run migrations/seeding**: `npm run seed`

## Running the Application

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

## API Documentation

Once the application is running, visit:
- **Swagger UI**: http://localhost:3000/api
- **Application**: http://localhost:3000

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Stores
- `GET /stores` - Get all stores (paginated, searchable)
- `GET /stores/:id` - Get store by ID
- `POST /stores` - Create store (requires auth)
- `PATCH /stores/:id` - Update store (requires auth)
- `DELETE /stores/:id` - Delete store (requires auth)

### Products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product (requires auth)

### Store Products
- `POST /stores/:storeId/products` - Add product to store (requires auth)
- `GET /stores/:storeId/products` - Get store products (paginated, filtered)
- `PATCH /stores/:storeId/products/:storeProductId` - Update store product (requires auth)
- `DELETE /stores/:storeId/products/:storeProductId` - Remove product from store (requires auth)

### Cart (Optional)
- `POST /cart/quote` - Calculate cart total price

## Production Deployment

The backend is deployed at `http://18.218.246.134/api` with full Swagger documentation ready for creating new records.

For production deployment:
1. Set `NODE_ENV=production`
2. Use database migrations instead of synchronization
3. Configure proper JWT secret
4. Set up proper database credentials
5. Use a process manager like PM2

## Docker Development

The application is configured to work with Docker Compose. See the main project README for Docker setup instructions.

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Project Structure

```
src/
├── auth/                 # Authentication module
├── cart/                 # Cart calculation module
├── entities/             # TypeORM entities
├── products/             # Products module
├── seeds/                # Database seeding
├── store-products/       # Store products module
├── stores/               # Stores module
├── app.controller.ts     # Main controller
├── app.module.ts         # Main module
├── app.service.ts        # Main service
└── main.ts              # Application entry point
```

## License

This project is part of the Choppi technical assessment.