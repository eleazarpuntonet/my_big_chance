# Choppi App (Flutter)

Aplicación móvil para Choppi construida con Flutter y patrón BLoC/Cubit. Parte de la solución full-stack completa que incluye backend NestJS y frontend Next.js.

## Características

- **Framework**: Flutter con Dart
- **Estado**: Patrón BLoC/Cubit para gestión de estado
- **API**: Dio para llamadas HTTP
- **Navegación**: GoRouter para enrutamiento declarativo
- **Autenticación**: JWT con manejo de tokens
- **UI**: Material Design con componentes personalizados

## Arquitectura

La aplicación sigue una arquitectura basada en características (feature-based):

```
lib/
├── features/          # Módulos basados en características
│   └── [feature]/
│       ├── bloc/      # Lógica BLoC y gestión de estado
│       ├── data/      # Capa de datos (repositorios, servicios, modelos)
│       └── presentation/ # Capa UI (páginas, widgets)
├── core/              # Utilidades y temas principales
├── shared/            # Widgets y utilidades compartidas
└── main.dart          # Punto de entrada
```

## Instalación

### Prerrequisitos
- Flutter SDK instalado
- Android Studio o VS Code con extensiones Flutter
- Dispositivo Android o emulador

```bash
# Instalar dependencias
flutter pub get
```

## Desarrollo Local

```bash
# Ejecutar en dispositivo/emulador
flutter run

# Construir APK
flutter build apk

# Construir para iOS (macOS)
flutter build ios
```

## Docker

Para desarrollo con Docker:

```bash
# Desarrollo con Docker Compose
docker compose up --build

# Acceder en: localhost:8080
```

## Características Implementadas

### Pantallas
- **Login**: Autenticación de usuarios
- **Stores**: Lista de tiendas con búsqueda
- **Store Detail**: Productos de una tienda con filtros
- **Product Detail**: Información detallada de producto

### Funcionalidades
- **Autenticación**: Login con JWT
- **Catálogo**: Navegación de tiendas y productos
- **Búsqueda**: Búsqueda por nombre
- **Filtros**: Filtro por productos en stock
- **Estados**: Manejo de carga y errores
- **Carrito Local**: Agregar/quitar productos (bonus)

### UI/UX
- **Material Design**: Componentes Flutter nativos
- **Responsive**: Adaptable a diferentes tamaños de pantalla
- **Animaciones**: Transiciones suaves
- **Estados de Carga**: Indicadores de progreso

## API Integration

- **Dio**: Cliente HTTP para llamadas a la API
- **Manejo de Errores**: Estados de error en BLoC
- **Autenticación**: Headers con Bearer token
- **Modelos**: Clases Dart para serialización JSON

## Testing

```bash
# Ejecutar tests
flutter test

# Tests con coverage
flutter test --coverage
```

## Producción

### APK Lista
La aplicación ha sido compilada y la APK está lista para instalación en dispositivos Android. Incluye:

- **Instalación**: Archivo APK listo para instalar
- **Autenticación**: Login completo con validación
- **Acceso a Recursos**: Navegación completa del catálogo
- **Conexión**: Configurada para conectarse a `http://18.218.246.134/api`

### Build de Producción

```bash
# Generar APK de producción
flutter build apk --release

# El APK se genera en: build/app/outputs/flutter-apk/app-release.apk
```

## Configuración

### Variables de Entorno
Crear archivo de configuración en `lib/core/config/`:

```dart
class Config {
  static const String apiUrl = 'http://18.218.246.134/api';
  // O para desarrollo: 'http://localhost:3000'
}
```

## Dependencias Principales

- `flutter_bloc`: Gestión de estado BLoC
- `dio`: Cliente HTTP
- `go_router`: Navegación
- `shared_preferences`: Almacenamiento local
- `flutter_secure_storage`: Almacenamiento seguro

## Estructura de Estados BLoC

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
}
```

## Contribución

Para nuevas características:

1. Crear directorio en `lib/features/[feature]/`
2. Implementar modelos en `data/models/`
3. Crear repositorio en `data/repositories/`
4. Implementar BLoC en `bloc/`
5. Crear widgets en `presentation/`
6. Agregar rutas en GoRouter

## Estado

✅ **Completado**: Aplicación móvil totalmente funcional con todas las características requeridas, APK lista para instalación.