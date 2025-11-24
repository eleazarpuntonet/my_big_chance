# Instrucciones para Asistente de Codificación AI

## Resumen de Arquitectura

Esta es una aplicación de comercio electrónico full-stack con **arquitectura backend NestJS** implementando un sistema de catálogo tienda-producto:
- **Backend**: NestJS (TypeScript) en `choppi-backend/` con entidades TypeORM, autenticación JWT, y documentación API Swagger
- **Modelo de Datos**: Entidades Usuario/Tienda/Producto/ProductoTienda con relaciones muchos-a-muchos tienda-producto a través de tabla de unión
- **Opciones Frontend**: Next.js (HashRouter) en `frontend/` o Flutter (Bloc/Cubit) en `choppi-app/` (ambos implementados)
- **Infraestructura**: PostgreSQL con Docker Compose, configuración basada en entorno en directorio `.envs/`

## Flujos de Trabajo Críticos

### Configuración de Desarrollo Local
```bash
# Desde la raíz del proyecto - inicia todos los servicios con recarga en caliente
docker compose up --build

# Endpoints de servicios (desarrollo):
# - Backend (NestJS): http://localhost:3000 (Swagger: /api)
# - Frontend (Next.js): http://localhost:5000
# - PostgreSQL: localhost:8832 (solo interno)
# - Flutter: localhost:8080 (para desarrollo)
```

### Configuración de Producción con Traefik
```bash
# Producción con enrutamiento Traefik
docker compose -f docker-compose.production.yml up --build

# Endpoints de servicios (producción vía Traefik):
# - Frontend: http://172.31.75.75/app
# - API Backend: http://172.31.75.75/api (Swagger: /api)
# - Traefik: http://172.31.75.75 (puerto 80)
# - PostgreSQL: Solo interno, no expuesto
```

### Enrutamiento Traefik
Traefik maneja el enrutamiento basado en host y prefijos de ruta:
- `Host(172.31.75.75) && PathPrefix(/app)` → nginx_frontend
- `Host(172.31.75.75) && PathPrefix(/api)` → nginx_backend

### Operaciones de Base de Datos
```bash
# Sembrar base de datos con datos de muestra (3 tiendas, 20 productos, asociaciones tienda-producto)
cd choppi-backend && npm run seed

# Conexión a base de datos vía variables de entorno (ver .envs/.local/.backend)
# Sincronización TypeORM habilitada en desarrollo, migraciones requeridas en producción
```

### Flujo de Autenticación
- Autenticación basada en JWT protegiendo operaciones POST/PUT/DELETE
- Endpoints de registro/login retornan `{ access_token: string }`
- Token Bearer requerido en header `Authorization: Bearer <token>`
- Entidad usuario con email/contraseña (hasheada con bcrypt)

## Patrones Específicos del Proyecto

### Implementación Backend (NestJS/TypeORM)
- **APIs Requeridas** (del README.md):
  - Auth: Login JWT protegiendo POST/PUT/DELETE
  - Stores: CRUD con paginación, búsqueda (`?q=` param)
  - Products: Catálogo global (GET /products/:id, POST /products)
  - StoreProducts: Inventario por tienda (precio, stock) con filtros (`?q=`, `?inStock=true`)

#### Patrones de Entidades
- **Claves Primarias UUID**: Todas las entidades usan `@PrimaryGeneratedColumn('uuid')`
- **Eliminaciones Suaves**: Usar campo `isActive: boolean` en lugar de eliminaciones duras
- **Timestamps**: `@CreateDateColumn()` y `@UpdateDateColumn()` en todas las entidades
- **Relaciones**: Decoradores `@OneToMany`/`@ManyToOne` explícitos para navegación

#### Patrones de API
- **Paginación**: Requerida para todos los endpoints de lista (`?page=1&limit=10`)
- **Búsqueda**: Consultas ILIKE con parámetro `?q=` para búsqueda insensible a mayúsculas
- **Filtrado**: Filtros booleanos como `?inStock=true` para productos de tienda
- **Validación**: `class-validator` con `whitelist: true, forbidNonWhitelisted: true`
- **Manejo de Errores**: Excepciones consistentes de NestJS (`NotFoundException`, `BadRequestException`, etc.)

#### Patrones de Servicio
```typescript
// QueryBuilder para consultas complejas con joins
const queryBuilder = this.storeProductRepository
  .createQueryBuilder('storeProduct')
  .leftJoinAndSelect('storeProduct.product', 'product')
  .where('storeProduct.storeId = :storeId', { storeId });

// Formato de respuesta de paginación
return { data, total, page, limit };
```

### Flujo de Trabajo Docker
- **Desarrollo**: Recarga en caliente habilitada, volúmenes montados para edición en vivo
- **Producción**: Builds multi-etapa, usuarios no-root, assets compilados

#### Patrones de Controlador
```typescript
// Rutas protegidas por auth usan @UseGuards(JwtAuthGuard)
@Post()
@UseGuards(JwtAuthGuard)
async create(@Body() dto: CreateDto) { ... }

// Parámetros de consulta con validación
async findAll(@Query() query: GetQueryDto) { ... }
```

### Patrón de Siembra de Datos
- Script de siembra independiente (`seed.ts`) usando contexto de aplicación NestFactory
- Crea tiendas → productos → asociaciones tienda-producto con precios/stock aleatorios
- Variación de precio: ±20% del precio base, stock: 0-50 unidades

### Implementación Frontend (Next.js)
- **HashRouter**: Usa React Router con HashRouter para enrutamiento del lado cliente
- **Estilos**: Tailwind CSS con PostCSS
- **Gestión de Estado**: Zustand para estado global
- **Llamadas API**: Axios a través de capa ApiService (no SWR)
- **Formularios**: React Hook Form con patrón Controller

#### Arquitectura Basada en Características
Todos los módulos frontend deben seguir esta arquitectura basada en características para mantenibilidad y escalabilidad:

##### Estructura de Módulo
```
src/views/[module]/
├── views/              # Componentes de página (páginas Next.js)
├── components/         # Componentes UI específicos de este módulo
├── store/              # Stores Zustand para gestión de estado global
├── hooks/              # Hooks personalizados reutilizables
├── repositories/       # Capa de acceso a datos (llamadas API, almacenamiento local)
├── services/           # Capa de lógica de negocio (transformación de datos, validación)
└── types/              # Tipos/interfaces TypeScript para este módulo
```

##### Flujo de Datos
- **Estado Global**: Todos los datos fluyen a través de stores Zustand para comunicación entre componentes
- **Acciones**: Las acciones del store pueden usarse en diferentes componentes y vistas
- **Tipado**: Fuertemente tipado con TypeScript, sincronizado con tipos del backend
- **Sincronización**: Los tipos del frontend deben coincidir exactamente con los DTOs del backend

##### Flujo de Creación de Módulo
1. **Definir Tipos**: Crear tipos/interfaces coincidiendo con DTOs del backend
2. **Implementar Repositorio**: Crear llamadas API con tipado apropiado
3. **Crear Servicio**: Capa de lógica de negocio llamando repositorios
4. **Configurar Store**: Store Zustand con acciones y estado
5. **Construir Componentes**: Componentes reutilizables siguiendo plantilla ECME
6. **Crear Vistas**: Componentes de página usando componentes y store
7. **Agregar Enrutamiento**: Configurar rutas de Next.js App Router

#### Estructura Frontend
- **Estructura de Archivos**: Basada en características en `views/`, componentes compartidos en `components/`
- **TypeScript**: Tipado estricto con `@types/` personalizados
- **Imports**: Alias de rutas con prefijo `@/`
- **Estado**: Actualizaciones inmutables con Zustand

#### Convenciones de Nomenclatura
- **Archivos**: kebab-case para directorios, PascalCase para componentes
- **Variables**: camelCase, PascalCase para tipos/interfaces
- **Base de Datos**: snake_case para columnas, PascalCase para entidades
- **API**: Endpoints RESTful con nomenclatura consistente

#### Headers Modernos con Gradientes
Todos los headers principales deben seguir este patrón moderno:
```tsx
<div className="bg-gradient-to-r from-[color1]-500 to-[color2]-600 p-4 rounded-t-xl">
  <div className="flex items-center justify-between">
    <div className="flex items-center">
      <TbIcon className="w-6 h-6 text-white mr-3" />
      <h4 className="text-lg font-semibold text-white">Título del Header</h4>
    </div>
    <div className="flex items-center space-x-4">
      {/* Estadísticas en backdrop-blur */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="text-[color1]-100 text-sm">Etiqueta</div>
      </div>
    </div>
  </div>
</div>
```

#### Cards Modernas
Las cards deben usar este diseño consistente:
```tsx
<div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
  {/* Header con gradiente */}
  <div className="bg-gradient-to-r from-[color]-500 to-[color]-600 p-4">
    <div className="flex items-center">
      <TbIcon className="w-6 h-6 text-white mr-3" />
      <h4 className="text-lg font-semibold text-white">Título de la Card</h4>
    </div>
  </div>
  {/* Contenido */}
  <div className="p-6">
    {/* Contenido específico */}
  </div>
</div>
```

#### Iconografía
- **Biblioteca Requerida**: `react-icons/tb` (Iconos Tabler)
- **Sintaxis**: `import { TbIconName } from 'react-icons/tb'`
- **Tamaños**: `w-6 h-6` para headers, `w-5 h-5` para elementos secundarios
- **Colores**: Blanco en headers con gradiente, colores temáticos en contenido

#### Tipografía
- **Headers Principales**: `text-lg font-semibold`
- **Etiquetas de Formulario**: `text-sm font-medium text-gray-700`
- **Texto Secundario**: `text-xs text-gray-500`
- **Valores Destacados**: `text-3xl font-bold` para números grandes

#### Efectos Visuales
- **Backdrop Blur**: `bg-white/10 backdrop-blur-sm` para overlays
- **Transiciones**: `transition-all` para estados hover
- **Gradientes**: `bg-gradient-to-r` para fondos atractivos
- **Sombras**: `shadow-lg` para profundidad

#### Estructura de Formularios
Todos los formularios de la aplicación deben seguir esta estructura estándar para consistencia y calidad:

##### 1. Imports
```typescript
import React from 'react'
import { Button, Form, FormItem, Input, Select } from '@/components/ui'
import { Controller, useForm } from 'react-hook-form'
import { useStore } from '../store/useStore' // Store Zustand correspondiente
import { QueryType } from '../types' // Tipos del módulo
import ButtonGroup from '@/components/ui/ButtonGroup'
import { TbIconName } from 'react-icons/tb' // Iconos Tabler
```

##### 2. Interfaz de Props
```typescript
interface FormComponentProps {
  onSubmit: (data: FormData) => void
  onClear?: () => void
  // Otras props específicas del componente
}
```

##### 3. Componente Funcional con Tipado
```typescript
const FormComponent: React.FC<FormComponentProps> = ({
  onSubmit,
  onClear
}) => {
  // Hooks y lógica aquí
}
```

##### 4. Uso de Hooks
- **React Hook Form**: `useForm<FormDataType>()` para manejo de formularios
- **Store Zustand**: Para estado global y sincronización con otros componentes
- **Watch/Control**: Para observar cambios en campos específicos

##### 5. Funciones Handler
```typescript
const onSubmit = (data: FormDataType) => {
  // Lógica de envío
}

const handleFieldChange = (value: any) => {
  // Lógica específica del campo
}

const handleClear = () => {
  reset() // Reset del formulario
  onClear?.() // Callback opcional
}
```

##### 6. Estructura JSX
```tsx
<div className="mb-6 bg-white p-4 rounded-lg shadow">
  <div className="flex flex-row">
    <Form
      className="h-full w-full flex-row justify-end"
      containerClassName="flex flex-row justify-between w-full h-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className='flex flex-row gap-1'>
        {/* Campos del formulario */}
        <FormItem label="Etiqueta">
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
            Acción
          </Button>
          <Button
            type='button'
            size="sm"
            icon={<TbIcon />}
            onClick={handleClear}
            className="px-3 py-1 bg-blue-600 text-white hover:bg-blue-700"
          >
            Limpiar
          </Button>
        </ButtonGroup>
      </div>
    </Form>
  </div>
</div>
```

##### 7. Patrones Obligatorios
- **React Hook Form**: Siempre usar para manejo de formularios
- **Patrón Controller**: Usar Controller de RHF para todos los campos
- **Integración Zustand**: Integrar con stores Zustand para estado global
- **TypeScript**: Tipado fuerte en todas las interfaces y funciones
- **Componentes UI**: Usar solo componentes de plantilla ECME
- **Iconos**: Siempre usar react-icons/tb (iconos Tabler)
- **ButtonGroup**: Agrupar botones de acción en ButtonGroup
- **Estilos**: Usar clases Tailwind consistentes
- **Layout**: Flex row con campos a la izquierda y botones a la derecha

#### Stores de Parámetros y Filtros en Cascada
##### 1. Store de Parámetros
```typescript
// src/store/parametersStore.ts
import { create } from 'zustand'
import ParametersService from '@/services/ParametersService'

interface ParametersState {
  states: State[]
  loadingStates: boolean
  fetchStates: () => Promise<void>
  // ... otros estados y acciones
}

export const useParametersStore = create<ParametersState>((set) => ({
  // Implementación del store
}))
```

##### 2. Filtrado en Cascada
```tsx
// En componente de formulario
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

##### 3. Componente Select con Opciones
```tsx
<Controller
  name="stateId"
  control={control}
  render={({ field }) => {
    const options = states.map(state => ({
      label: state.description || `Estado ${state.id}`,
      value: state.id
    }))
    const selectedValue = options.find(option => option.value === field.value)

    return (
      <Select
        options={options}
        value={selectedValue}
        onChange={(selectedOption) => field.onChange(selectedOption?.value)}
        placeholder="Seleccionar un estado"
      />
    )
  }}
/>
```

##### 4. Estados de Carga
- Mostrar placeholders informativos durante la carga
- Deshabilitar selects dependientes hasta que el padre esté seleccionado
- Indicar "Primero seleccionar X" para selects dependientes

#### Arquitectura de Formularios Complejos
Los formularios complejos con parámetros del sistema siguen esta estructura multi-capa:

##### 1. Vista Principal (`CreateCustomer.tsx`)
- Layout con Card y header de acciones
- Manejo de estado global y navegación
- Notificaciones toast
- Botón HelpButton para documentación

##### 2. Componente de Formulario (`CreateCustomerForm.tsx`)
- Campos organizados en grid responsivo
- Integración React Hook Form
- Selects con datos de parámetros
- Lógica de filtro en cascada

#### Estados de Carga y Placeholders Dinámicos
```tsx
<Select
  placeholder={
    !selectedStateId
      ? "Primero seleccionar un estado"
      : loadingMunicipalities
        ? "Cargando municipios..."
        : "Seleccionar un municipio"
  }
  disabled={!selectedStateId || loadingMunicipalities}
/>
```

#### Ejemplo de Implementación Completa
Ver `src/views/customers/components/CreateCustomerForm.tsx` y `src/views/customers/views/CreateCustomer.tsx` como referencia de implementación completa.

#### Patrón de Envío y Solicitud API

Todos los formularios deben seguir esta estructura estándar para manejo de envío de datos:

##### Vista Principal (`CreateCustomer.tsx`)
- **Responsabilidades**: Layout, navegación, manejo de estado global, notificaciones
- **Imports**: Store Zustand, componentes UI, navegación
- **Estructura**:
  - Header con título y botones de acción
  - Componente de formulario
  - Botón de ayuda (HelpButton)

##### Estructura handleSubmit
```tsx
const handleSubmit = async (data: FormDataType) => {
  try {
    // 1. Transformación de datos (opcional)
    const transformedData = {
      ...data,
      // Transformaciones específicas según necesidad
    }

    // 2. Llamada al store (maneja carga y errores)
    await storeAction(transformedData)

    // 3. Notificación de éxito con toast
    toast.push(
      <Notification type="success">
        Operación completada exitosamente
      </Notification>,
      { placement: 'top-center' },
    )

    // 4. Redirección automática (opcional)
    setTimeout(() => {
      navigate('/destination-route')
    }, 2000)

  } catch(error) {
    // 5. Notificación de error con toast
    toast.push(
      <Notification type="warning">
        Error: {error instanceof Error ? error.message : 'Error desconocido en operación'}
      </Notification>,
      { placement: 'top-center' },
    )
    console.error('Error:', error)
  }
}
```

##### Notificaciones Toast
```tsx
import { Notification, toast } from '@/components/ui'

// Éxito
toast.push(
  <Notification type="success">
    Operación completada exitosamente
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

// Tipos disponibles: success, warning, danger, info
```

##### Flujo de Solicitud API
```
Vista (handleSubmit) → Store (acción) → Servicio (lógica) → Repositorio (llamada API) → Backend
    ↑                      ↑              ↑                ↑                ↑
Transformación        Carga/Error   Validaciones    Solicitud HTTP    Endpoint
```

#### Manejo de Errores en Solicitudes API

Todos los bloques try-catch que hacen solicitudes API deben seguir este patrón estándar para manejo consistente de errores:

##### Patrón de Manejo de Errores
```tsx
import { AxiosError } from 'axios'
import { Notification, toast } from '@/components/ui'

try {
  // Llamada API
  await apiCall()
} catch(error) {
  if(error instanceof AxiosError) {
    const responseWithError = error.response
    const message = responseWithError?.data?.error

    if(Array.isArray(message)) {
      // Si el backend retorna array de errores, mostrar el primero
      toast.push(
        <Notification type="danger">
          {message[0]}
        </Notification>,
        { placement: 'top-center' }
      )
    } else {
      // Si es mensaje de error simple
      toast.push(
        <Notification type="danger">
          {message || 'Error desconocido en operación'}
        </Notification>,
        { placement: 'top-center' }
      )
    }
  } else {
    // Error genérico no relacionado con HTTP
    toast.push(
      <Notification type="danger">
        Error: {error instanceof Error ? error.message : 'Error desconocido'}
      </Notification>,
      { placement: 'top-center' }
    )
  }
  console.error('Error completo:', error)
}
```

##### Reglas del Patrón
- **Siempre verificar AxiosError**: Usar `error instanceof AxiosError` para identificar errores HTTP
- **Extraer mensaje del backend**: Buscar mensaje en `error.response?.data?.error`
- **Manejar arrays de error**: Si el backend retorna array, mostrar solo el primer elemento
- **Notificaciones consistentes**: Siempre usar componente `Notification` con `toast.push`
- **Ubicación fija**: Todas las notificaciones deben usar `{ placement: 'top-center' }`
- **Tipo de notificación**: Usar `type="danger"` para errores (nunca "success" para errores)
- **Fallback de mensaje**: Proporcionar mensajes predeterminados descriptivos
- **Logging**: Siempre incluir `console.error('Error completo:', error)` para depuración
- **Imports requeridos**: `AxiosError` de axios, `Notification, toast` de '@/components/ui'

#### Estados de Carga y Estados Vacíos
```tsx
{/* Estado vacío */}
<div className="text-center py-8">
  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
    <TbIcon className="w-8 h-8 text-gray-400" />
  </div>
  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay datos disponibles</h3>
  <p className="text-gray-500">Mensaje descriptivo</p>
</div>
```

#### Áreas de Scroll con Desvanecimiento
```tsx
<div className="max-h-64 overflow-y-auto relative before:absolute before:top-0 before:left-0 before:right-0 before:h-4 before:bg-gradient-to-b before:from-white before:to-transparent before:pointer-events-none before:z-10 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-4 after:bg-gradient-to-t after:from-white before:to-transparent before:pointer-events-none before:z-10">
  {/* Contenido scrollable */}
</div>
```

### Implementación Flutter (Bloc/Cubit)
- **Gestión de Estado**: Patrón BLoC con Cubit para gestión de estado más simple
- **Navegación**: GoRouter para enrutamiento declarativo
- **Llamadas API**: Dio para solicitudes HTTP
- **Arquitectura**: Basada en características con directorio `features/` conteniendo capas bloc/data/presentation

#### Estructura de Características Flutter
```
lib/features/[feature]/
├── bloc/              # Lógica BLoC y gestión de estado
├── data/              # Capa de datos (repositorios, servicios, modelos)
└── presentation/      # Capa UI (páginas, widgets)
```

#### Implementación del Patrón BLoC
```dart
// Estados
abstract class StoreState extends Equatable {
  const StoreState();
}

class StoresLoaded extends StoreState {
  final List<Store> stores;
  final int total, page, limit;
  const StoresLoaded(this.stores, this.total, this.page, this.limit);
}

// Eventos
abstract class StoreEvent extends Equatable {
  const StoreEvent();
}

class LoadStores extends StoreEvent {
  final String? query;
  const LoadStores({this.query});
}

// Bloc
class StoreBloc extends Bloc<StoreEvent, StoreState> {
  final StoreRepository _storeRepository;

  StoreBloc(this._storeRepository) : super(StoreInitial()) {
    on<LoadStores>(_onLoadStores);
  }

  Future<void> _onLoadStores(LoadStores event, Emitter<StoreState> emit) async {
    emit(StoreLoading());
    try {
      final response = await _storeRepository.getStores(query: event.query);
      emit(StoresLoaded(response.data, response.total, response.page, response.limit));
    } catch (e) {
      emit(StoreError(e.toString()));
    }
  }
}
```

### Configuración Docker
- **Desarrollo**: Montajes de volumen para recarga en caliente, node_modules excluidos
- **Base de Datos**: Health checks con `pg_isready`, volúmenes persistentes para datos/backups
- **Entorno**: Archivos `.env` separados para etapas local/producción
- **Estrategia de Volumen**: Montaje selectivo de archivos para preservar dependencias instaladas mientras habilitar recarga en caliente

## Archivos Clave y Estructura de Directorios

```
choppi-backend/src/
├── entities/           # Entidades TypeORM (User, Store, Product, StoreProduct)
├── auth/              # Módulo de autenticación JWT
├── stores/            # CRUD de tiendas con paginación/búsqueda
├── products/          # Catálogo global de productos
├── store-products/    # Inventario por tienda (precio/stock)
├── cart/              # Endpoint opcional de cotización de carrito
├── seeds/             # Servicio de siembra de base de datos
└── main.ts            # Configuración Swagger, pipes de validación

frontend/src/
├── auth/              # Contexto de autenticación y proveedores
├── components/        # Componentes UI reutilizables
├── services/          # Funciones de servicio API
├── store/             # Stores Zustand
└── views/             # Componentes de página

choppi-app/lib/
├── features/          # Módulos basados en características (auth, stores)
├── core/              # Utilidades y temas principales
├── shared/            # Widgets y utilidades compartidas
└── main.dart          # Punto de entrada de la app

.envs/
├── .local/            # Configuración Docker desarrollo
└── .production/       # Configuración despliegue en nube

docker-compose.yml     # Orquestación multi-servicio
```

## Prioridades de Desarrollo

1. **Implementación API**: Completar endpoints NestJS según requisitos del README
2. **Relaciones de Base de Datos**: Asegurar relaciones apropiadas de entidades y claves foráneas
3. **Autenticación**: Guards JWT en rutas protegidas
4. **Paginación/Búsqueda**: Implementación consistente en todos los endpoints de lista
5. **Integración Frontend**: Elegir Next.js o Flutter, implementar navegación de catálogo
6. **Testing**: Tests unitarios para servicios, E2E para flujos críticos
7. **Despliegue**: Railway/Render para backend, Vercel para Next.js

## Estándares de Calidad

- **TypeScript**: Tipado estricto, sin tipos `any`
- **Validación**: class-validator en todos los DTOs, pipes de validación whitelist
- **Base de Datos**: Migraciones TypeORM en producción, indexación apropiada
- **Diseño API**: Convenciones RESTful, respuestas de error consistentes
- **Documentación**: Anotaciones Swagger, descripciones claras de API
- **Seguridad**: Hashing de contraseñas bcrypt, manejo de expiración JWT
- **Frontend**: TypeScript estricto, React Hook Form para formularios, Zustand para estado, iconos Tabler, patrones UI consistentes
- **Formularios**: Patrón Controller con RHF, ButtonGroup para acciones, manejo de errores con notificaciones toast
- **Estilos**: Tailwind CSS con sistema de diseño consistente, headers con gradiente, efectos backdrop blur
- **Paleta de Colores**:
  - Primario: #FAA531 (Naranja)
  - Fondo: #F9FAFB (Gris Claro)
  - Texto Oscuro: #111827 (Gris Oscuro)
  - Texto Medio: #4B5563 (Gris Medio)
  - Texto Claro: #9CA3AE (Gris Claro)
  - Negro: #000000
  - Primario Suave: rgba(250, 165, 49, 0.1)
- **Integración API**: Axios a través de capa ApiService, manejo consistente de errores, estados de carga

## Patrones Comunes

### Agregando Nuevas Características
1. **Backend**: Crear módulo → controlador → servicio → entidades → DTOs
2. **Frontend**: Crear estructura de módulo → definir tipos → implementar repositorio (ApiService) → crear servicio → configurar store Zustand → construir componentes (reutilizar plantilla ECME) → crear vistas → agregar enrutamiento
3. **Database**: Actualizaciones manuales de esquema (sin auto-migración)
4. **Auth**: Verificar permisos en guards, actualizar entidades rol/permiso

#### Integración API
- Usar `ApiService.fetchDataWithAxios<T>()` para solicitudes tipadas
- Manejar errores en bloques `catch` con retroalimentación apropiada al usuario
- Incluir estados de carga para operaciones asíncronas
- **Arquitectura**: Siempre seguir patrón servicio → repositorio → ApiService
- **Sin fetch**: Nunca usar `fetch` directamente, siempre usar ApiService a través de capa repositorio
- **URL Base**: Configurada vía variable de entorno `VITE_APIURL` (desarrollo: localhost:3000, producción: URL API configurada)