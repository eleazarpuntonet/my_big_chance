# AI Coding Assistant Instructions

## Architecture Overview

This is a full-stack application with **NestJS backend architecture**:
- **Backend**: NestJS (TypeScript) in `choppi-backend/` - currently basic starter, needs implementation per README requirements

**Frontend Options** (choose one):
- Next.js (TypeScript) in `frontend/` - App Router, Tailwind CSS
- Flutter (Dart) in `flutter/` - Bloc/Cubit state management

**Infrastructure**:
- PostgreSQL database with health checks
- Docker Compose for local development
- Environment-based configuration in `.envs/` directory

## Critical Workflows

### Local Development Setup
```bash
# From project root
docker-compose up --build

# Services start on:
# - Backend (NestJS): http://localhost:3000
# - Frontend (Next.js): http://localhost:3001
# - Flutter: Container ready for development
# - PostgreSQL: localhost:5432 (internal only)
```

### Environment Configuration
- **Local**: `.envs/.local/` - Docker-based development
- **Production**: `.envs/.production/` - Cloud deployment ready
- Backend connects via `DATABASE_URL` environment variable
- Frontend uses `NEXT_PUBLIC_API_URL=http://localhost:3000`

### Database Operations
- PostgreSQL with custom user/password (see `.envs/.local/.postgres`)
- NestJS connects via `DATABASE_URL` environment variable

## Project-Specific Patterns

### Backend Implementation (NestJS)
- **Required APIs** (from README.md):
  - Auth: JWT-based login protecting POST/PUT/DELETE
  - Stores: CRUD with pagination, search (`?q=` param)
  - Products: Global catalog (GET /products/:id, POST /products)
  - StoreProducts: Per-store inventory (price, stock) with filters (`?q=`, `?inStock=true`)

- **Standards**: TypeORM entities, class-validator, Swagger docs, strict TypeScript
- **Pagination**: Required for all list endpoints (>20 items)
- **Search**: ILIKE queries for name-based search

### Frontend Patterns
- **Next.js**: App Router, protected routes for admin operations
- **Flutter**: Bloc/Cubit for state management, Dio for HTTP
- **UX Requirements**: Loading states, error handling, pagination UI

### Docker Workflow
- **Development**: Hot reload enabled, volumes mounted for live editing
- **Production**: Multi-stage builds, non-root users, compiled assets

## Key Files & Directories

- `docker-compose.yml` - Local development orchestration
- `.envs/` - Environment-specific configuration (never commit secrets)
- `choppi-backend/src/` - NestJS implementation (currently starter template)
- `frontend/` - Next.js app (currently empty)
- `flutter/` - Flutter app (currently empty)

## Development Priorities

1. **Implement NestJS APIs** per README requirements (auth, stores, products, storeproducts)
2. **Choose frontend** (Next.js recommended for web focus)
3. **Database integration** with TypeORM entities and migrations
4. **Authentication flow** with JWT tokens
5. **Swagger documentation** for API testing

## Deployment Notes

- **Backend**: Railway/Render/Fly.io for NestJS
- **Frontend**: Vercel for Next.js, generate APK for Flutter
- **Database**: Managed PostgreSQL in production

## Quality Standards

- **TypeScript**: Strict typing throughout
- **Testing**: Unit tests (Jest) + E2E tests
- **Linting**: ESLint + Prettier configured
- **Commits**: Clear messages, feature branches
- **Documentation**: Swagger API docs, setup instructions</content>
<parameter name="filePath">d:\Workplace\my_full_stack\.github\copilot-instructions.md