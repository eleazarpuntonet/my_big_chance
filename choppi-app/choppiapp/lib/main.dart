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
import 'features/products/presentation/pages/products_page.dart';
import 'features/products/presentation/pages/create_product_page.dart';
import 'shared/widgets/custom_navigation_wrapper.dart';
import 'features/products/bloc/product_bloc.dart';
import 'features/products/data/repositories/product_repository.dart';
import 'features/products/data/services/product_service.dart';

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

    final productService = ProductService();
    final productRepository = ProductRepository(productService);

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
        GoRoute(
          path: '/products',
          builder: (context, state) => const ProductsPage(),
        ),
        GoRoute(
          path: '/products/:id',
          builder: (context, state) => ProductDetailPage(
            productId: state.pathParameters['id']!,
          ),
        ),
        GoRoute(
          path: '/products/create',
          builder: (context, state) => const CreateProductPage(),
        ),
        GoRoute(
          path: '/stores/:storeId/add-product',
          builder: (context, state) => AddProductToStorePage(
            storeId: state.pathParameters['storeId']!,
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
        BlocProvider(
          create: (context) => ProductBloc(productRepository),
        ),
      ],
      child: CustomNavigationWrapper(
        child: MaterialApp.router(
          title: 'Choppi App',
          theme: AppTheme.lightTheme,
          routerConfig: router,
          debugShowCheckedModeBanner: false,
        ),
      ),
    );
  }
}
