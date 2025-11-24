import 'package:dio/dio.dart';
import 'dart:convert';

class AuthService {
  final Dio _dio = Dio(BaseOptions(
    baseUrl: 'http://18.218.246.134/api',
    connectTimeout: const Duration(seconds: 10),
    receiveTimeout: const Duration(seconds: 10),
  ));

  AuthService() {
    // Configurar interceptores si es necesario
    _dio.interceptors.add(LogInterceptor(requestBody: true, responseBody: true));
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await _dio.post(
        '/auth/login',
        data: {
          'email': email,
          'password': password,
        },
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        // Respuesta exitosa según el formato especificado
        final data = response.data;
        if (data is Map<String, dynamic> && data.containsKey('access_token')) {
          return data;
        } else {
          throw Exception('Respuesta del servidor inválida: falta access_token');
        }
      } else {
        throw Exception('Error HTTP ${response.statusCode}: ${response.statusMessage}');
      }
    } on DioException catch (e) {
      // Mejorar el manejo de errores según el formato especificado
      if (e.response != null) {
        final statusCode = e.response?.statusCode ?? 500;
        final responseData = e.response?.data;

        if (responseData is Map<String, dynamic>) {
          // Manejar errores según el formato especificado
          final message = responseData['message'] ?? 'Error desconocido';
          final error = responseData['error'] ?? 'Error';
          final errorStatusCode = responseData['statusCode'] ?? statusCode;

          // Crear una excepción más descriptiva
          throw AuthException(
            message: message,
            error: error,
            statusCode: errorStatusCode,
            originalMessage: e.message ?? 'Sin mensaje adicional',
          );
        } else if (statusCode == 401) {
          // Error de credenciales inválidas
          throw AuthException(
            message: 'Credenciales inválidas',
            error: 'Unauthorized',
            statusCode: 401,
            originalMessage: e.message ?? 'Credenciales incorrectas',
          );
        } else {
          throw AuthException(
            message: 'Error del servidor',
            error: 'Server Error',
            statusCode: statusCode,
            originalMessage: e.response?.statusMessage ?? e.message ?? 'Error desconocido',
          );
        }
      } else {
        // Error de red
        throw AuthException(
          message: 'Error de conexión',
          error: 'Network Error',
          statusCode: 0,
          originalMessage: e.message ?? 'Sin conexión a internet',
        );
      }
    } catch (e) {
      // Re-lanzar AuthException o convertir otros errores
      if (e is AuthException) {
        rethrow;
      }
      throw AuthException(
        message: 'Error inesperado',
        error: 'Unexpected Error',
        statusCode: 500,
        originalMessage: e.toString(),
      );
    }
  }

  // Método para verificar token si es necesario
  Future<bool> verifyToken(String token) async {
    try {
      final response = await _dio.get(
        '/auth/verify',
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }
}

// Clase personalizada para excepciones de autenticación
class AuthException implements Exception {
  final String message;
  final String error;
  final int statusCode;
  final String originalMessage;

  AuthException({
    required this.message,
    required this.error,
    required this.statusCode,
    required this.originalMessage,
  });

  @override
  String toString() {
    return 'AuthException: $message (Error: $error, Status: $statusCode)';
  }

  // Método para obtener mensaje amigable para el usuario
  String get userFriendlyMessage {
    switch (statusCode) {
      case 401:
        return 'Credenciales inválidas. Verifique su email y contraseña.';
      case 0:
        return 'Error de conexión. Verifique su conexión a internet.';
      case 500:
        return 'Error del servidor. Intente nuevamente más tarde.';
      default:
        return message;
    }
  }
}