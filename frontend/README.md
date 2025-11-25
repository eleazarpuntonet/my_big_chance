# Choppi Frontend (Next.js)

Frontend de la aplicación Choppi construido con Next.js, TypeScript y Tailwind CSS. Parte de la solución full-stack completa que incluye backend NestJS y aplicación móvil Flutter.

## Características

- **Framework**: Next.js con App Router
- **Lenguaje**: TypeScript con tipado estricto
- **Estilos**: Tailwind CSS con PostCSS
- **Estado Global**: Zustand para gestión de estado
- **API Integration**: Axios a través de capa ApiService
- **Formularios**: React Hook Form con validación Zod
- **UI Components**: Componentes reutilizables siguiendo patrón ECME
- **Autenticación**: JWT con contexto de autenticación
- **Navegación**: Catálogo completo de tiendas y productos

## Arquitectura

El frontend sigue una arquitectura basada en características (feature-based):

```
src/
├── views/              # Páginas Next.js (App Router)
│   └── [feature]/
│       ├── views/      # Componentes de página
│       ├── components/ # Componentes UI específicos
│       ├── store/      # Stores Zustand
│       ├── hooks/      # Hooks personalizados
│       ├── repositories/ # Capa de acceso a datos
│       ├── services/   # Lógica de negocio
│       └── types/      # Tipos TypeScript
├── components/         # Componentes compartidos
├── services/           # Servicios globales (ApiService)
├── store/             # Stores globales
└── utils/              # Utilidades
```

## Instalación

```bash
# Instalar dependencias
npm install
```

## Variables de Entorno

Crear archivo `.env.local`:

```bash
# URL de la API del backend
VITE_APIURL=http://localhost:3000

# En producción
VITE_APIURL=http://18.218.246.134/api
```

## Desarrollo Local

```bash
# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de producción
npm run preview
```

## Docker

El frontend está configurado para ejecutarse en Docker:

```bash
# Desarrollo con Docker Compose
docker compose up --build

# Acceder en: http://localhost:5000
```

## Características Implementadas

### Páginas
- `/login` - Autenticación de usuarios
- `/stores` - Lista de tiendas con búsqueda y paginación
- `/stores/[id]` - Detalle de tienda con productos
- `/products/[id]` - Detalle de producto
- `/admin` - Panel de administración (bonus)

### Funcionalidades
- **Autenticación**: Login/register con JWT
- **Catálogo**: Navegación completa de tiendas y productos
- **Búsqueda**: Búsqueda por nombre con paginación
- **Filtros**: Filtro por productos en stock
- **Estados**: Manejo de carga, errores y estados vacíos
- **Responsive**: Diseño adaptativo para móviles y desktop

### UI/UX
- **Headers Modernos**: Gradientes con iconos Tabler
- **Cards**: Diseño consistente con sombras y bordes
- **Formularios**: Patrón Controller con RHF y ButtonGroup
- **Notificaciones**: Toast para éxito y errores
- **Paleta de Colores**: Esquema consistente (Naranja #FAA531 como primario)

## API Integration

- **Capa ApiService**: Centralización de llamadas HTTP
- **Manejo de Errores**: Patrón consistente con notificaciones
- **Estados de Carga**: Loading states en todas las operaciones
- **Autenticación**: Bearer token automático en headers

## Testing

```bash
# Ejecutar tests
npm run test

# Coverage
npm run test:coverage
```

## Producción

El frontend está desplegado en `http://18.218.246.134/app` a través de Traefik.

Para deploy local en producción:

```bash
docker compose -f docker-compose.production.yml up --build
```

## Dependencias Principales

- `next`: Framework React
- `react`: Biblioteca UI
- `typescript`: Tipado
- `tailwindcss`: Estilos
- `zustand`: Estado global
- `axios`: HTTP client
- `react-hook-form`: Formularios
- `@hookform/resolvers`: Validación
- `react-icons/tb`: Iconos Tabler

## Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Build producción
npm run start        # Start producción
npm run preview      # Vista previa
npm run lint         # Linting
npm run test         # Tests
```

## Contribución

El frontend sigue las pautas establecidas en las instrucciones del proyecto. Para nuevas características:

1. Crear estructura de módulo en `src/views/[feature]/`
2. Definir tipos en `types/`
3. Implementar repositorio para API calls
4. Crear servicio para lógica de negocio
5. Configurar store Zustand
6. Construir componentes siguiendo patrón ECME
7. Crear vistas Next.js
8. Agregar rutas en App Router

## Estado

✅ **Completado**: Frontend totalmente funcional con todas las características requeridas.
