import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class CustomNavigationWrapper extends StatelessWidget {
  final Widget child;

  const CustomNavigationWrapper({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        // Obtener la ruta actual
        final currentLocation = GoRouter.of(context).routerDelegate.currentConfiguration.uri.toString();

        // Si estamos en la página principal, permitir cerrar la app
        if (currentLocation == '/' || currentLocation == '/login') {
          return true;
        }

        // Para otras páginas, navegar hacia atrás en el historial
        if (context.canPop()) {
          context.pop();
          return false;
        }

        // Si no hay historial, ir a la página principal
        context.go('/');
        return false;
      },
      child: child,
    );
  }
}