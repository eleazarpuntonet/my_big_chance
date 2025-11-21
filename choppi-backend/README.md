# Choppi Backend (NestJS)

Backend API for the Choppi full-stack application built with NestJS, TypeORM, and PostgreSQL.

## Features

- **Authentication**: JWT-based authentication with login/register
- **Stores Management**: CRUD operations for stores with pagination and search
- **Products Catalog**: Global product management
- **Store Products**: Per-store product inventory with pricing and stock
- **Cart Calculation**: Optional cart quote endpoint
- **Swagger Documentation**: Complete API documentation
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

The application uses TypeORM with synchronization enabled for development. For production, use migrations.

## Running the Application

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

## Seeding the Database

To populate the database with sample data:

```bash
npm run seed
```

This will create:
- 3 sample stores
- 20 sample products
- Store-product associations with varying prices and stock

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

## Docker Development

The application is configured to work with Docker Compose. See the main project README for Docker setup instructions.

## Production Deployment

For production deployment:
1. Set `NODE_ENV=production`
2. Use database migrations instead of synchronization
3. Configure proper JWT secret
4. Set up proper database credentials
5. Use a process manager like PM2

## License

This project is part of the Choppi technical assessment.