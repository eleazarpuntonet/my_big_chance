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

      if (response.statusCode == 200) {
        return response.data;
      } else {
        throw Exception('Login failed: ${response.statusMessage}');
      }
    } on DioException catch (e) {
      if (e.response != null) {
        throw Exception('Login failed: ${e.response?.data['error'] ?? e.message}');
      } else {
        throw Exception('Network error: ${e.message}');
      }
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