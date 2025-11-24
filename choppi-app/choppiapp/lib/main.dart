import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'core/theme/app_theme.dart';
import 'features/auth/bloc/auth_bloc.dart';
import 'features/auth/data/repositories/auth_repository.dart';
import 'features/auth/data/services/auth_service.dart';
import 'features/auth/presentation/pages/login_page.dart';
import 'features/stores/presentation/pages/stores_page.dart';
import 'features/stores/presentation/pages/store_detail_page.dart';
import 'features/stores/bloc/store_bloc.dart';
import 'features/stores/data/repositories/store_repository.dart';
import 'features/stores/data/services/store_service.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    // Crear servicios y repositorios
    final authService = AuthService();
    final authRepository = AuthRepository(authService);

    final storeService = StoreService();
    final storeRepository = StoreRepository(storeService);

    // Configurar GoRouter
    final router = GoRouter(
      routes: [
        GoRoute(
          path: '/',
          builder: (context, state) => const StoresPage(),
        ),
        GoRoute(
          path: '/login',
          builder: (context, state) => const LoginPage(),
        ),
        GoRoute(
          path: '/stores/:id',
          builder: (context, state) => StoreDetailPage(
            storeId: state.pathParameters['id']!,
          ),
        ),
      ],
      redirect: (context, state) {
        // Aquí podríamos agregar lógica de redirección basada en autenticación
        return null;
      },
    );

    return MultiBlocProvider(
      providers: [
        BlocProvider(
          create: (context) => AuthBloc(authRepository),
        ),
        BlocProvider(
          create: (context) => StoreBloc(storeRepository),
        ),
      ],
      child: MaterialApp.router(
        title: 'Choppi App',
        theme: AppTheme.lightTheme,
        routerConfig: router,
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}
