# AI Coding Assistant Instructions

## Architecture Overview
Full-stack e-commerce app: NestJS backend (TypeORM, PostgreSQL, JWT), Next.js frontend (Zustand, Axios), Docker with Traefik production routing.

## Critical Workflows
- **Dev Setup**: `docker compose up --build` → Backend http://localhost:3000, Frontend http://localhost:5000
- **Production**: `docker compose -f docker-compose.production.yml up --build` → http://172.31.75.75/app & /api
- **Seed DB**: `cd choppi-backend && npm run seed`

## Backend Patterns (NestJS/TypeORM)
- **Entities**: UUID PKs, `isActive` soft deletes, timestamps, explicit relations
- **APIs**: Pagination (`?page=1&limit=10`), ILIKE search (`?q=`), filters (`?inStock=true`)
- **Validation**: class-validator with whitelist pipes
- **Queries**: QueryBuilder for joins, return `{data, total, page, limit}`

## Frontend Patterns (Next.js)
- **Architecture**: Feature-based modules in `src/views/[module]/` with views/components/store/services/repositories/types
- **State**: Zustand stores with actions calling services
- **API**: Repository → Service → ApiService.fetchDataWithAxios<T>()
- **Forms**: React Hook Form with Controller pattern, ButtonGroup, toast notifications
- **UI**: Tailwind, Tabler icons, gradient headers, consistent card designs

## Key Conventions
- **Backend**: Soft deletes, UUIDs, consistent error handling
- **Frontend**: Strict TS, no `any`, feature modules, Axios only via ApiService
- **Naming**: camelCase vars, PascalCase types, kebab-case dirs
- **Auth**: JWT in headers, protected routes with guards

## Adding Features
- **Backend**: Module → Controller → Service → Entity/DTOs
- **Frontend**: Types → Repository → Service → Zustand Store → Components → Views → Routes
