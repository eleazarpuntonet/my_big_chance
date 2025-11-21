# AI Coding Assistant Instructions

## Architecture Overview

This is a full-stack e-commerce application with **NestJS backend architecture** implementing a store-product catalog system:
- **Backend**: NestJS (TypeScript) in `choppi-backend/` with TypeORM entities, JWT authentication, and Swagger API docs
- **Data Model**: User/Store/Product/StoreProduct entities with many-to-many store-product relationships via junction table
- **Frontend Options**: Next.js (App Router) in `frontend/` or Flutter (Bloc/Cubit) in `flutter/` (currently minimal implementations)
- **Infrastructure**: PostgreSQL with Docker Compose, environment-based configuration in `.envs/` directory

## Critical Workflows

### Local Development Setup
```bash
# From project root - starts all services with hot reload
docker compose up --build

# Services endpoints:
# - Backend (NestJS): http://localhost:3000 (Swagger: /api)
# - Frontend (Next.js): http://localhost:3001
# - PostgreSQL: localhost:5432 (internal only)
```

### Database Operations
```bash
# Seed database with sample data (3 stores, 20 products, store-product associations)
cd choppi-backend && npm run seed

# Database connection via environment variables (see .envs/.local/.backend)
# TypeORM sync enabled in development, migrations required for production
```

### Authentication Flow
- JWT-based auth protecting POST/PUT/DELETE operations
- Register/Login endpoints return `{ access_token: string }`
- Bearer token required in `Authorization: Bearer <token>` header
- User entity with email/password (bcrypt hashed)

## Project-Specific Patterns

### Backend Implementation (NestJS/TypeORM)
- **Required APIs** (from README.md):
  - Auth: JWT-based login protecting POST/PUT/DELETE
  - Stores: CRUD with pagination, search (`?q=` param)
  - Products: Global catalog (GET /products/:id, POST /products)
  - StoreProducts: Per-store inventory (price, stock) with filters (`?q=`, `?inStock=true`)

#### Entity Patterns
- **UUID Primary Keys**: All entities use `@PrimaryGeneratedColumn('uuid')`
- **Soft Deletes**: Use `isActive: boolean` field instead of hard deletes
- **Timestamps**: `@CreateDateColumn()` and `@UpdateDateColumn()` on all entities
- **Relations**: Explicit `@OneToMany`/`@ManyToOne` decorators for navigation

#### API Patterns
- **Pagination**: Required for all list endpoints (`?page=1&limit=10`)
- **Search**: ILIKE queries with `?q=` parameter for case-insensitive name search
- **Filtering**: Boolean filters like `?inStock=true` for store products
- **Validation**: `class-validator` with `whitelist: true, forbidNonWhitelisted: true`
- **Error Handling**: Consistent NestJS exceptions (`NotFoundException`, `BadRequestException`, etc.)

#### Service Patterns
```typescript
// QueryBuilder for complex queries with joins
const queryBuilder = this.storeProductRepository
  .createQueryBuilder('storeProduct')
  .leftJoinAndSelect('storeProduct.product', 'product')
  .where('storeProduct.storeId = :storeId', { storeId });

// Pagination response format
return { data, total, page, limit };
```

### Docker Workflow
- **Development**: Hot reload enabled, volumes mounted for live editing
- **Production**: Multi-stage builds, non-root users, compiled assets

#### Controller Patterns
```typescript
// Auth-protected routes use @UseGuards(JwtAuthGuard)
@Post()
@UseGuards(JwtAuthGuard)
async create(@Body() dto: CreateDto) { ... }

// Query parameters with validation
async findAll(@Query() query: GetQueryDto) { ... }
```

### Data Seeding Pattern
- Standalone seed script (`seed.ts`) using NestFactory application context
- Creates stores → products → store-product associations with randomized pricing/stock
- Price variation: ±20% from base price, stock: 0-50 units

### Docker Configuration
- **Development**: Volume mounts for hot reload, node_modules excluded
- **Database**: Health checks with `pg_isready`, persistent volumes for data/backups
- **Environment**: Separate `.env` files for local/production stages
- **Volume Strategy**: Selective file mounting to preserve installed dependencies while enabling hot reload

## Key Files & Directory Structure

```
choppi-backend/src/
├── entities/           # TypeORM entities (User, Store, Product, StoreProduct)
├── auth/              # JWT authentication module
├── stores/            # Store CRUD with pagination/search
├── products/          # Global product catalog
├── store-products/    # Per-store inventory (price/stock)
├── cart/              # Optional cart quote endpoint
├── seeds/             # Database seeding service
└── main.ts            # Swagger setup, validation pipes

.envs/
├── .local/            # Docker development config
└── .production/       # Cloud deployment config

docker-compose.yml     # Multi-service orchestration
```

## Development Priorities

1. **API Implementation**: Complete NestJS endpoints per README requirements
2. **Database Relations**: Ensure proper entity relationships and foreign keys
3. **Authentication**: JWT guards on protected routes
4. **Pagination/Search**: Consistent implementation across all list endpoints
5. **Frontend Integration**: Choose Next.js or Flutter, implement catalog browsing
6. **Testing**: Unit tests for services, E2E for critical flows
7. **Deployment**: Railway/Render for backend, Vercel for Next.js

## Quality Standards

- **TypeScript**: Strict typing, no `any` types
- **Validation**: class-validator on all DTOs, whitelist validation pipes
- **Database**: TypeORM migrations in production, proper indexing
- **API Design**: RESTful conventions, consistent error responses
- **Documentation**: Swagger annotations, clear API descriptions
- **Security**: Bcrypt password hashing, JWT expiration handling</content>
<parameter name="filePath">d:\Workplace\my_full_stack\.github\copilot-instructions.md