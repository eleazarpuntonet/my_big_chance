# Choppi - Aplicación Full-Stack Completada

## Estado del Proyecto
Esta aplicación full-stack ha sido completamente implementada y está lista para entrega. Incluye un backend robusto con NestJS, un frontend moderno con Next.js, una aplicación móvil nativa con Flutter, y una base de datos PostgreSQL, todo orquestado con Docker y Docker Compose.

## Arquitectura
La aplicación utiliza una arquitectura basada en contenedores con Docker y Docker Compose, proporcionando dos entornos claramente definidos:

### Versión de Desarrollo
- **Docker Compose**: `docker-compose.yml`
- **Características**: Recarga en caliente, volúmenes montados para desarrollo, sincronización automática de base de datos
- **Servicios**: Backend (NestJS), Frontend (Next.js), Base de datos (PostgreSQL), Flutter (para desarrollo móvil)

### Versión de Producción
- **Docker Compose**: `docker-compose.production.yml`
- **Características**: Builds multi-etapa, usuarios no-root, assets compilados, Traefik como reverse proxy
- **Despliegue Actual**: La aplicación está desplegada y accesible en `http://18.218.246.134`

## Componentes Implementados

### Backend (NestJS + TypeScript)
- **Framework**: NestJS con TypeORM
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT con protección en rutas POST/PUT/DELETE
- **Documentación**: Swagger completamente configurado en `/api`
- **Características**: CRUD completo para Stores, Products y StoreProducts con paginación, búsqueda y filtros

### Frontend (Next.js + TypeScript)
- **Framework**: Next.js con App Router
- **Estilos**: Tailwind CSS
- **Estado**: Zustand para gestión de estado global
- **API**: Axios a través de capa ApiService
- **Características**: Interfaz completa para navegación de catálogo, autenticación y gestión de datos

### Aplicación Móvil (Flutter)
- **Framework**: Flutter con patrón BLoC/Cubit
- **Estado**: Gestión de estado con Cubit
- **API**: Dio para llamadas HTTP
- **Características**: APK generada y lista para instalación, con autenticación completa y acceso a recursos

### Base de Datos (PostgreSQL)
- **Motor**: PostgreSQL con Docker
- **ORM**: TypeORM con entidades bien definidas
- **Relaciones**: Many-to-many entre Stores y Products a través de tabla de unión StoreProducts

## Despliegue Actual
La aplicación está desplegada en producción en la dirección IP `18.218.246.134`. Los servicios están accesibles a través de Traefik:
- **Frontend**: `http://18.218.246.134/app`
- **API Backend**: `http://18.218.246.134/api`
- **Documentación Swagger**: `http://18.218.246.134/api` (lista para crear nuevos registros)

## Documentación Swagger
La documentación de la API está completamente implementada y accesible. Incluye:
- Endpoints para autenticación (login/register)
- CRUD completo para Stores, Products y StoreProducts
- Filtros de búsqueda, paginación y validaciones
- Ejemplos de requests/responses
- **Capacidad para crear nuevos registros** directamente desde la interfaz Swagger

## Aplicación Móvil (APK)
La aplicación Flutter ha sido compilada y la APK está lista para instalación. Características:
- **Instalación**: APK disponible para dispositivos Android
- **Autenticación**: Login completo con JWT
- **Acceso a Recursos**: Navegación completa del catálogo, gestión de productos por tienda
- **Estados**: Manejo de carga, errores y estados vacíos

## Setup Local

### Prerrequisitos
- Docker y Docker Compose instalados
- Node.js (para desarrollo local opcional)
- Flutter SDK (para desarrollo móvil)

### Versión de Desarrollo
```bash
# Desde la raíz del proyecto
docker compose up --build
```

**Endpoints en desarrollo:**
- Backend (NestJS): http://localhost:3000
- Frontend (Next.js): http://localhost:5000
- Base de datos: localhost:8832 (interno)
- Flutter: localhost:8080 (desarrollo)

### Versión de Producción
```bash
# Desde la raíz del proyecto
docker compose -f docker-compose.production.yml up --build
```

**Endpoints en producción local:**
- Frontend: http://localhost/app
- API Backend: http://localhost/api
- Traefik Dashboard: http://localhost (puerto 80)

## Poblar la Base de Datos y Crear Estructura

### Desde Imágenes Docker (Recomendado - Desde Cero)
Si estás trabajando con imágenes desde cero:

1. **Construir las imágenes**:
```bash
# Construir todas las imágenes
docker compose build

# O específicamente para producción
docker compose -f docker-compose.production.yml build
```

2. **Iniciar los servicios**:
```bash
# Desarrollo
docker compose up --build

# Producción
docker compose -f docker-compose.production.yml up --build
```

3. **Crear estructura de base de datos**:
   - En **desarrollo**: TypeORM sincroniza automáticamente las tablas al iniciar
   - En **producción**: Las migraciones se ejecutan automáticamente en el contenedor

4. **Poblar con datos de muestra**:
```bash
# Acceder al contenedor del backend
docker compose exec choppi-backend bash

# Ejecutar el seed
npm run seed
```

Esto creará:
- 3 tiendas de muestra
- 20 productos globales
- Asociaciones tienda-producto con precios y stock aleatorios

### Desarrollo Local (Sin Docker)
Si prefieres desarrollo local:

1. **Backend**:
```bash
cd choppi-backend
npm install
# Configurar .env con variables de BD
npm run start:dev
```

2. **Frontend**:
```bash
cd frontend
npm install
npm run dev
```

3. **Base de datos**: Asegurarse de que PostgreSQL esté corriendo localmente

4. **Poblar BD**:
```bash
cd choppi-backend
npm run seed
```

## Variables de Entorno

### Desarrollo (`.envs/.local/.backend`)
```bash
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=choppi_user
DB_PASSWORD=choppi_password
DB_DATABASE=choppi_db

JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
PORT=3000
```

### Producción (`.envs/.production/.backend`)
```bash
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=choppi_user
DB_PASSWORD=choppi_password
DB_DATABASE=choppi_db

JWT_SECRET=production-jwt-secret
NODE_ENV=production
PORT=3000
```

## Usuario Demo
- **Email**: demo@choppi.com
- **Password**: demo123

## Estructura del Proyecto
```
├── choppi-backend/        # Backend NestJS
├── frontend/              # Frontend Next.js
├── choppi-app/            # App Flutter
├── docker-compose.yml     # Desarrollo
├── docker-compose.production.yml  # Producción
├── .envs/                 # Variables de entorno
└── scripts/               # Scripts auxiliares
```

## Tecnologías Utilizadas
- **Backend**: NestJS, TypeORM, PostgreSQL, JWT, Swagger
- **Frontend**: Next.js, TypeScript, Tailwind CSS, Zustand, Axios
- **Móvil**: Flutter, BLoC/Cubit, Dio
- **Infraestructura**: Docker, Docker Compose, Traefik, Nginx
- **Base de Datos**: PostgreSQL con TypeORM

## Próximos Pasos
La aplicación está completamente funcional y lista para uso en producción. Para escalar:
1. Configurar CI/CD con GitHub Actions
2. Implementar monitoreo con herramientas como Prometheus
3. Agregar tests automatizados más exhaustivos
4. Configurar backups automáticos de base de datos

## Licencia
Proyecto desarrollado como parte de evaluación técnica para Choppi.
