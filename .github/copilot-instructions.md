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

# Services endpoints (development):
# - Backend (NestJS): http://localhost:3000 (Swagger: /api)
# - Frontend (Next.js): http://localhost:5000
# - PostgreSQL: localhost:8832 (internal only)
# - Flutter: localhost:8080 (for development)
```

### Production Setup with Traefik
```bash
# Production with Traefik routing
docker compose -f docker-compose.production.yml up --build

# Services endpoints (production via Traefik):
# - Frontend: http://172.31.75.75/app
# - Backend API: http://172.31.75.75/api (Swagger: /api)
# - Traefik: http://172.31.75.75 (port 80)
# - PostgreSQL: Internal only, not exposed
```

### Traefik Routing
Traefik handles routing based on host and path prefixes:
- `Host(172.31.75.75) && PathPrefix(/app)` → nginx_frontend
- `Host(172.31.75.75) && PathPrefix(/api)` → nginx_backend

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

### Frontend Implementation (Next.js)
- **App Router**: Uses Next.js 13+ App Router structure
- **Styling**: Tailwind CSS with PostCSS
- **State Management**: Zustand for global state
- **API Calls**: Axios with SWR for data fetching
- **Forms**: React Hook Form with Zod validation

#### Feature-Based Architecture
All frontend modules must follow this feature-based architecture for maintainability and scalability:

##### Module Structure
```
src/views/[module]/
├── views/              # Page components (Next.js pages)
├── components/         # UI components specific to this module
├── store/              # Zustand stores for global state management
├── hooks/              # Reusable custom hooks
├── repositories/       # Data access layer (API calls, local storage)
├── services/           # Business logic layer (data transformation, validation)
└── types/              # TypeScript types/interfaces for this module
```

##### Data Flow
- **Global State**: All data flows through Zustand stores for cross-component communication
- **Actions**: Store actions can be used across different components and views
- **Typing**: Strongly typed with TypeScript, synchronized with backend types
- **Synchronization**: Frontend types must match backend DTOs exactly

##### Module Creation Workflow
1. **Define Types**: Create types/interfaces matching backend DTOs
2. **Implement Repository**: Create API calls with proper typing
3. **Create Service**: Business logic layer calling repositories
4. **Configure Store**: Zustand store with actions and state
5. **Build Components**: Reusable components following ECME template
6. **Create Views**: Page components using components and store
7. **Add Routing**: Configure Next.js App Router routes

#### Frontend Structure
- **File Structure**: Feature-based in `views/`, shared components in `components/`
- **TypeScript**: Strict typing with custom `@types/`
- **Imports**: Path aliases with `@/` prefix
- **State**: Immutable updates with Zustand

#### Naming Conventions
- **Files**: kebab-case for directories, PascalCase for components
- **Variables**: camelCase, PascalCase for types/interfaces
- **Database**: snake_case for columns, PascalCase for entities
- **API**: RESTful endpoints with consistent naming

#### Modern Headers with Gradients
All main headers must follow this modern pattern:
```tsx
<div className="bg-gradient-to-r from-[color1]-500 to-[color2]-600 p-4 rounded-t-xl">
  <div className="flex items-center justify-between">
    <div className="flex items-center">
      <TbIcon className="w-6 h-6 text-white mr-3" />
      <h4 className="text-lg font-semibold text-white">Header Title</h4>
    </div>
    <div className="flex items-center space-x-4">
      {/* Statistics in backdrop-blur */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="text-[color1]-100 text-sm">Label</div>
      </div>
    </div>
  </div>
</div>
```

#### Modern Cards
Cards must use this consistent design:
```tsx
<div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
  {/* Header with gradient */}
  <div className="bg-gradient-to-r from-[color]-500 to-[color]-600 p-4">
    <div className="flex items-center">
      <TbIcon className="w-6 h-6 text-white mr-3" />
      <h4 className="text-lg font-semibold text-white">Card Title</h4>
    </div>
  </div>
  {/* Content */}
  <div className="p-6">
    {/* Specific content */}
  </div>
</div>
```

#### Iconography
- **Required Library**: `react-icons/tb` (Tabler Icons)
- **Syntax**: `import { TbIconName } from 'react-icons/tb'`
- **Sizes**: `w-6 h-6` for headers, `w-5 h-5` for secondary elements
- **Colors**: White in gradient headers, thematic colors in content

#### Typography
- **Main Headers**: `text-lg font-semibold`
- **Form Labels**: `text-sm font-medium text-gray-700`
- **Secondary Text**: `text-xs text-gray-500`
- **Highlighted Values**: `text-3xl font-bold` for large numbers

#### Visual Effects
- **Backdrop Blur**: `bg-white/10 backdrop-blur-sm` for overlays
- **Transitions**: `transition-all` for hover states
- **Gradients**: `bg-gradient-to-r` for attractive backgrounds
- **Shadows**: `shadow-lg` for depth

#### Form Structure
All application forms must follow this standard structure for consistency and quality:

##### 1. Imports
```typescript
import React from 'react'
import { Button, Form, FormItem, Input, Select } from '@/components/ui'
import { Controller, useForm } from 'react-hook-form'
import { useStore } from '../store/useStore' // Corresponding Zustand store
import { QueryType } from '../types' // Module types
import ButtonGroup from '@/components/ui/ButtonGroup'
import { Iconos } from 'react-icons/tb' // Tabler icons
```

##### 2. Props Interface
```typescript
interface FormComponentProps {
  onSubmit: (data: FormData) => void
  onClear?: () => void
  // Other component-specific props
}
```

##### 3. Functional Component with Typing
```typescript
const FormComponent: React.FC<FormComponentProps> = ({
  onSubmit,
  onClear
}) => {
  // Hooks and logic here
}
```

##### 4. Hook Usage
- **React Hook Form**: `useForm<FormDataType>()` for form handling
- **Zustand Store**: For global state and synchronization with other components
- **Watch/Control**: To observe changes in specific fields

##### 5. Handler Functions
```typescript
const onSubmit = (data: FormDataType) => {
  // Submission logic
}

const handleFieldChange = (value: any) => {
  // Field-specific logic
}

const handleClear = () => {
  reset() // Form reset
  onClear?.() // Optional callback
}
```

##### 6. JSX Structure
```tsx
<div className="mb-6 bg-white p-4 rounded-lg shadow">
  <div className="flex flex-row">
    <Form
      className="h-full w-full flex-row justify-end"
      containerClassName="flex flex-row justify-between w-full h-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className='flex flex-row gap-1'>
        {/* Form fields */}
        <FormItem label="Label">
          <Controller
            name="fieldName"
            control={control}
            render={({ field }) => (
              <Input
                size="sm"
                placeholder="Placeholder"
                {...field}
              />
            )}
          />
        </FormItem>
      </div>
      <div className='flex flex-row gap-1'>
        <ButtonGroup>
          <Button
            type="submit"
            shape='round'
            size="sm"
            icon={<TbIcon />}
            className="px-3 py-1 bg-blue-600 text-white hover:bg-blue-700"
          >
            Action
          </Button>
          <Button
            type='button'
            size="sm"
            icon={<TbIcon />}
            onClick={handleClear}
            className="px-3 py-1 bg-blue-600 text-white hover:bg-blue-700"
          >
            Clear
          </Button>
        </ButtonGroup>
      </div>
    </Form>
  </div>
</div>
```

##### 7. Mandatory Patterns
- **React Hook Form**: Always use for form handling
- **Controller Pattern**: Use RHF Controller for all fields
- **Zustand Integration**: Integrate with Zustand stores for global state
- **TypeScript**: Strong typing in all interfaces and functions
- **UI Components**: Use only ECME template components
- **Icons**: Always use react-icons/tb (Tabler icons)
- **ButtonGroup**: Group action buttons in ButtonGroup
- **Styles**: Use consistent Tailwind classes
- **Layout**: Flex row with fields on left and buttons on right

#### Parameter Stores and Cascading Filters
##### 1. Parameter Store
```typescript
// src/store/parametersStore.ts
import { create } from 'zustand'
import ParametersService from '@/services/ParametersService'

interface ParametersState {
  states: State[]
  loadingStates: boolean
  fetchStates: () => Promise<void>
  // ... other states and actions
}

export const useParametersStore = create<ParametersState>((set) => ({
  // Store implementation
}))
```

##### 2. Cascading Filtering
```tsx
// In form component
const selectedStateId = watch('stateId')
const selectedMunicipalityId = watch('municipalityId')

useEffect(() => {
  if (selectedStateId) {
    fetchMunicipalities(selectedStateId)
    setValue('municipalityId', undefined)
    setValue('parishId', undefined)
  }
}, [selectedStateId])
```

##### 3. Select Component with Options
```tsx
<Controller
  name="stateId"
  control={control}
  render={({ field }) => {
    const options = states.map(state => ({
      label: state.description || `State ${state.id}`,
      value: state.id
    }))
    const selectedValue = options.find(option => option.value === field.value)

    return (
      <Select
        options={options}
        value={selectedValue}
        onChange={(selectedOption) => field.onChange(selectedOption?.value)}
        placeholder="Select a state"
      />
    )
  }}
/>
```

##### 4. Loading States
- Show informative placeholders during loading
- Disable dependent selects until parent is selected
- Indicate "First select X" for dependent selects

#### Complex Form Architecture
Complex forms with system parameters follow this multi-layer structure:

##### 1. Main View (`CreateCustomer.tsx`)
- Layout with Card and action header
- Global state handling and navigation
- Toast notifications
- HelpButton for documentation

##### 2. Form Component (`CreateCustomerForm.tsx`)
- Fields organized in responsive grid
- React Hook Form integration
- Selects with parameter data
- Cascading filter logic

#### Loading States and Dynamic Placeholders
```tsx
<Select
  placeholder={
    !selectedStateId
      ? "First select a state"
      : loadingMunicipalities
        ? "Loading municipalities..."
        : "Select a municipality"
  }
  disabled={!selectedStateId || loadingMunicipalities}
/>
```

#### Complete Implementation Example
See `src/views/customers/components/CreateCustomerForm.tsx` and `src/views/customers/views/CreateCustomer.tsx` as complete implementation reference.

#### Submit Pattern and API Request

All forms must follow this standard structure for data submission handling:

##### Main View (`CreateCustomer.tsx`)
- **Responsibilities**: Layout, navigation, global state handling, notifications
- **Imports**: Zustand store, UI components, navigation
- **Structure**:
  - Header with title and action buttons
  - Form component
  - Help button (HelpButton)

##### handleSubmit Structure
```tsx
const handleSubmit = async (data: FormDataType) => {
  try {
    // 1. Data transformation (optional)
    const transformedData = {
      ...data,
      // Specific transformations as needed
    }

    // 2. Store call (handles loading and errors)
    await storeAction(transformedData)

    // 3. Success notification with toast
    toast.push(
      <Notification type="success">
        Operation completed successfully
      </Notification>,
      { placement: 'top-center' },
    )

    // 4. Automatic redirection (optional)
    setTimeout(() => {
      navigate('/destination-route')
    }, 2000)

  } catch(error) {
    // 5. Error notification with toast
    toast.push(
      <Notification type="warning">
        Error: {error instanceof Error ? error.message : 'Unknown error'}
      </Notification>,
      { placement: 'top-center' },
    )
    console.error('Error:', error)
  }
}
```

##### Toast Notifications
```tsx
import { Notification, toast } from '@/components/ui'

// Success
toast.push(
  <Notification type="success">
    Operation completed successfully
  </Notification>,
  { placement: 'top-center' },
)

// Error
toast.push(
  <Notification type="warning">
    Error: {error.message}
  </Notification>,
  { placement: 'top-center' },
)

// Available types: success, warning, danger, info
```

##### API Request Flow
```
View (handleSubmit) → Store (action) → Service (logic) → Repository (API call) → Backend
    ↑                      ↑              ↑                ↑                ↑
Transformation        Loading/Error   Validations    HTTP Request    Endpoint
```

#### Error Handling in API Requests

All try-catch blocks that make API requests must follow this standard pattern for consistent error handling:

##### Error Handling Pattern
```tsx
import { AxiosError } from 'axios'
import { Notification, toast } from '@/components/ui'

try {
  // API call
  await apiCall()
} catch(error) {
  if(error instanceof AxiosError) {
    const responseWithError = error.response
    const message = responseWithError?.data?.error

    if(Array.isArray(message)) {
      // If backend returns error array, show first one
      toast.push(
        <Notification type="danger">
          {message[0]}
        </Notification>,
        { placement: 'top-center' }
      )
    } else {
      // If simple error message
      toast.push(
        <Notification type="danger">
          {message || 'Unknown error in operation'}
        </Notification>,
        { placement: 'top-center' }
      )
    }
  } else {
    // Generic error not related to HTTP
    toast.push(
      <Notification type="danger">
        Error: {error instanceof Error ? error.message : 'Unknown error'}
      </Notification>,
      { placement: 'top-center' }
    )
  }
  console.error('Complete error:', error)
}
```

##### Pattern Rules
- **Always check AxiosError**: Use `error instanceof AxiosError` to identify HTTP errors
- **Extract backend message**: Look for message in `error.response?.data?.error`
- **Handle error arrays**: If backend returns array, show only first element
- **Consistent notifications**: Always use `Notification` component with `toast.push`
- **Fixed placement**: All notifications must use `{ placement: 'top-center' }`
- **Notification type**: Use `type="danger"` for errors (never "success" for errors)
- **Message fallback**: Provide descriptive default messages
- **Logging**: Always include `console.error('Complete error:', error)` for debugging
- **Required imports**: `AxiosError` from axios, `Notification, toast` from '@/components/ui'

#### Loading States and Empty States
```tsx
{/* Empty state */}
<div className="text-center py-8">
  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
    <TbIcon className="w-8 h-8 text-gray-400" />
  </div>
  <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
  <p className="text-gray-500">Descriptive message</p>
</div>
```

#### Scroll Areas with Fade
```tsx
<div className="max-h-64 overflow-y-auto relative before:absolute before:top-0 before:left-0 before:right-0 before:h-4 before:bg-gradient-to-b before:from-white before:to-transparent before:pointer-events-none before:z-10 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-4 after:bg-gradient-to-t after:from-white after:to-transparent after:pointer-events-none after:z-10">
  {/* Scrollable content */}
</div>
```

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

frontend/src/
├── auth/              # Authentication context and providers
├── components/        # Reusable UI components
├── services/          # API service functions
├── store/             # Zustand stores
└── views/             # Page components

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
- **Security**: Bcrypt password hashing, JWT expiration handling
- **Frontend**: Strict TypeScript, React Hook Form for forms, Zustand for state, Tabler icons, consistent UI patterns
- **Forms**: Controller pattern with RHF, ButtonGroup for actions, error handling with toast notifications
- **Styling**: Tailwind CSS with consistent design system, gradient headers, backdrop blur effects
- **API Integration**: Axios through ApiService layer, consistent error handling, loading states

## Common Patterns

### Adding New Features
1. **Backend**: Create module → controller → service → entities → DTOs
2. **Frontend**: Create module structure → define types → implement repository (ApiService) → create service → configure Zustand store → build components (reuse ECME template) → create views → add routing
3. **Database**: Manual schema updates (no auto-migration)
4. **Auth**: Check permissions in guards, update role/permission entities

#### API Integration
- Use `ApiService.fetchDataWithAxios<T>()` for typed requests
- Handle errors in `catch` blocks with appropriate user feedback
- Include loading states for async operations
- **Architecture**: Always follow service → repository → ApiService pattern
- **No fetch**: Never use `fetch` directly, always use ApiService through repository layer
- **Production API URL**: In production, frontend calls `http://172.31.75.75/api`
<parameter name="filePath">d:\Workplace\my_full_stack\.github\copilot-instructions.md