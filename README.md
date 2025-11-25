# Choppi - Full Stack E-commerce Application

[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![Flutter](https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white)](https://flutter.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
[![AWS](https://img.shields.io/badge/AWS_EC2-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com)

Choppi es una aplicación de comercio electrónico full-stack que implementa un sistema de catálogo tienda-producto. La arquitectura está compuesta por múltiples contenedores Docker que incluyen PostgreSQL, backend NestJS, frontend Next.js y una aplicación móvil Flutter.

## ⚠️ **IMPORTANTE: Disponibilidad Limitada**

🚨 **El servidor EC2 estará disponible solo hasta el 2 de diciembre de 2025** (7 días desde el 25/11/2025). Después de esta fecha, la aplicación en producción dejará de estar accesible.

**📱 Descarga la APK ahora:** [choppi_app.apk](choppi_app.apk) - ¡Instala la aplicación móvil antes de que expire el servidor!

## 🏗️ Arquitectura

### Stack Tecnológico

- **Backend**: NestJS (TypeScript) con TypeORM y PostgreSQL
- **Frontend Web**: Next.js (React) con Tailwind CSS
- **Frontend Móvil**: Flutter (Dart) con BLoC pattern
- **Base de Datos**: PostgreSQL
- **Infraestructura**: Docker, Docker Compose, Nginx, Traefik
- **Despliegue**: AWS EC2 con enrutamiento Traefik

### Servicios en Contenedores

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PostgreSQL    │    │    NestJS       │    │    Next.js      │
│   (Database)    │◄──►│    (Backend)    │◄──►│   (Frontend)    │
│                 │    │   API REST      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │    Flutter      │
                    │   (Mobile App)  │
                    │                 │
                    └─────────────────┘
```

## 🚀 Inicio Rápido

### Desarrollo Local

Para iniciar el stack completo en modo desarrollo:

```bash
# Desde la raíz del proyecto
docker compose up --build
```

**Endpoints de desarrollo:**
- **Backend API**: http://localhost:3000 (Swagger: /api)
- **Frontend Web**: http://localhost:5000
- **Base de Datos**: localhost:8832 (solo interno)

### Producción

La aplicación está desplegada en AWS EC2 con enrutamiento Traefik:

**Endpoints de producción:**
- **Frontend Web**: http://172.31.75.75/app
- **Backend API**: http://172.31.75.75/api
- **Página de Registro**: http://172.31.75.75/app/sign-up
- **Página de Login**: http://172.31.75.75/app/sign-in
- **Traefik Dashboard**: http://172.31.75.75

⚠️ **IMPORTANTE:** Estos endpoints estarán disponibles solo hasta el **2 de diciembre de 2025**. Después de esta fecha, el servidor EC2 expirará y la aplicación dejará de estar accesible en producción.

## 📁 Estructura del Proyecto

```
my_full_stack/
├── choppi-backend/          # Backend NestJS
│   ├── src/
│   │   ├── entities/        # Entidades TypeORM
│   │   ├── auth/           # Autenticación JWT
│   │   ├── stores/         # CRUD de tiendas
│   │   ├── products/       # Catálogo de productos
│   │   └── store-products/ # Inventario por tienda
│   ├── Dockerfile.dev
│   ├── Dockerfile.prod
│   └── package.json
├── frontend/                # Frontend Next.js
│   ├── src/
│   │   ├── views/          # Páginas y componentes
│   │   ├── services/       # Servicios API
│   │   └── store/          # Zustand stores
│   ├── Dockerfile.dev
│   ├── Dockerfile.prod
│   └── package.json
├── choppi-app/             # Aplicación Flutter
│   ├── lib/
│   │   ├── features/       # Módulos BLoC
│   │   ├── core/          # Utilidades
│   │   └── shared/        # Componentes compartidos
│   └── pubspec.yaml
├── docker_images/          # Imágenes Docker empaquetadas
├── compose/                # Configuraciones Docker
│   ├── local/             # Desarrollo
│   └── production/        # Producción
├── .envs/                 # Variables de entorno
├── docker-compose.yml     # Desarrollo
├── docker-compose.production.yml  # Producción
└── README.md
```

## 🔧 Configuración y Despliegue

### Variables de Entorno

Los archivos de configuración están organizados por entorno:

```
.envs/
├── .local/                # Desarrollo local
│   ├── .backend           # Configuración backend dev
│   ├── .frontend          # Configuración frontend dev
│   └── .postgres          # Configuración PostgreSQL dev
└── .production/           # Producción
    ├── .backend           # Configuración backend prod
    ├── .frontend          # Configuración frontend prod
    └── .postgres          # Configuración PostgreSQL prod
```

### Proceso de Despliegue en Producción

1. **Compilar contenedores:**
   ```bash
   docker compose -f docker-compose.production.yml build
   ```

2. **Guardar imágenes en archivos .tar:**
   ```bash
   ./pull_and_save_images.sh
   ```

3. **Empaquetar para despliegue:**
   - `docker_images/` - Imágenes .tar
   - `traefik.yml` - Configuración de enrutamiento
   - `.envs/` - Variables de entorno
   - `docker-compose.production.yml` - Orquestación
   - `load_images.sh` - Script de carga de imágenes

4. **En el servidor EC2:**
   ```bash
   # Cargar imágenes en Docker
   ./load_images.sh

   # Iniciar servicios
   docker compose -f docker-compose.production.yml up -d
   ```

## 📱 Aplicación Móvil Flutter

### 🚀 **¡Descarga la APK Ahora!**

[![Download APK](https://img.shields.io/badge/Download-APK-blue?style=for-the-badge&logo=android&logoColor=white)](choppi_app.apk)

**Archivo APK disponible:** [choppi_app.apk](choppi_app.apk) (ubicado en la raíz del repositorio)

**⚠️ IMPORTANTE:** Descarga e instala la aplicación móvil **ANTES del 2 de diciembre de 2025**, ya que el servidor EC2 expirará y la app dejará de funcionar.

### Características
- **Framework**: Flutter con patrón BLoC
- **Plataformas**: Android (APK disponible)
- **Funcionalidades**:
  - Catálogo de productos completo
  - Gestión de tiendas
  - Navegación intuitiva con botones de home
  - Estados de carga y manejo de errores
  - Autenticación JWT completa

### Build de Producción

El APK compilado está disponible en dos ubicaciones:
- **Raíz del repo**: `choppi_app.apk` ← **¡Descárgalo aquí!**
- **Directorio Flutter**: `choppi-app/build/app/outputs/flutter-apk/app-release.apk`

### Instalación Rápida
1. **Descarga**: Haz clic en [choppi_app.apk](choppi_app.apk) o descarga desde la raíz del repo
2. **Transferir**: Copia el archivo a tu dispositivo Android
3. **Instalar**: Habilita "Instalación de fuentes desconocidas" en ajustes de Android
4. **Ejecutar**: Abre la app Choppi y comienza a explorar el catálogo

### 🎯 **Call to Action**
**¡No esperes!** El servidor expirará pronto. Descarga la APK ahora y ten la experiencia completa de Choppi en tu bolsillo. 📱✨

## 🔐 Autenticación y Seguridad

- **JWT Authentication**: Protección de endpoints POST/PUT/DELETE
- **CORS**: Configurado para permitir orígenes específicos
- **Validación**: Pipes de validación globales con class-validator
- **Hashing**: Contraseñas hasheadas con bcrypt

## 🗄️ Base de Datos

### Modelo de Datos
- **Entidades**: User, Store, Product, StoreProduct
- **Relaciones**: Muchos-a-muchos tienda-producto vía tabla de unión
- **Claves Primarias**: UUID en todas las entidades
- **Soft Deletes**: Campo `isActive` en lugar de eliminación física

### Seeding
```bash
cd choppi-backend && npm run seed
```
Crea automáticamente 3 tiendas, 20 productos y asociaciones tienda-producto con precios/stock aleatorios.

## 🧪 Testing y Calidad

### Backend
- **Unit Tests**: Servicios y utilidades
- **E2E Tests**: Flujos críticos de API
- **Linting**: ESLint configurado

### Frontend
- **TypeScript**: Tipado estricto
- **ESLint**: Linting y formateo
- **Responsive**: Diseño adaptable

### Flutter
- **Dart Analysis**: Análisis estático
- **Widget Tests**: Pruebas de componentes
- **Integration Tests**: Pruebas end-to-end

## 📊 API Endpoints

### Autenticación
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/register` - Registro de usuario

### Tiendas
- `GET /api/stores` - Listar tiendas (con paginación/búsqueda)
- `POST /api/stores` - Crear tienda
- `GET /api/stores/:id` - Detalles de tienda
- `PUT /api/stores/:id` - Actualizar tienda
- `DELETE /api/stores/:id` - Eliminar tienda

### Productos
- `GET /api/products` - Catálogo global
- `POST /api/products` - Crear producto
- `GET /api/products/:id` - Detalles de producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

### Productos por Tienda
- `GET /api/store-products?storeId=:id` - Inventario de tienda
- `POST /api/store-products` - Agregar producto a tienda
- `PUT /api/store-products/:id` - Actualizar precio/stock
- `DELETE /api/store-products/:id` - Remover producto de tienda

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto

- **Proyecto**: Choppi E-commerce
- **Stack**: Full-stack con NestJS, Next.js, Flutter
- **Despliegue**: AWS EC2 con Docker

---

⭐ Si este proyecto te resulta útil, ¡dale una estrella!

## ⏰ **¡ACTÚA ANTES DEL 2 DE DICIEMBRE!**

### 📋 **Lista de Verificación - No Pierdas la Oportunidad:**

- [ ] **Descarga la APK**: [choppi_app.apk](choppi_app.apk) - ¡Disponible en la raíz del repo!
- [ ] **Instala la app** en tu dispositivo Android
- [ ] **Prueba la aplicación completa** antes de que expire el servidor EC2
- [ ] **Explora el catálogo** de productos y tiendas
- [ ] **Configura tu propio entorno local** con Docker para desarrollo continuo

### 🎯 **¿Qué Sucede Después del 2 de Diciembre?**
- ❌ El servidor EC2 será descontinuado
- ❌ Los endpoints de producción dejarán de funcionar
- ❌ La aplicación móvil perderá conectividad con el backend
- ✅ **Pero podrás seguir desarrollando localmente!**

### 💡 **Recomendación:**
**Descarga la APK ahora mismo** y experimenta con la aplicación completa. El setup local con Docker te permitirá continuar desarrollando y mejorando Choppi sin límites de tiempo.

---

**¡Gracias por explorar Choppi!** 🚀📱</content>
<parameter name="oldString"># Choppi - Aplicación Full-Stack Completada

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
