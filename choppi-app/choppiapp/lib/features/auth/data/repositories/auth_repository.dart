import '../services/auth_service.dart';

class AuthRepository {
  final AuthService _authService;

  AuthRepository(this._authService);

  Future<String> login(String email, String password) async {
    final response = await _authService.login(email, password);
    final token = response['access_token'] as String;
    return token;
  }

  Future<String> register(String email, String password) async {
    final response = await _authService.register(email, password);
    final token = response['access_token'] as String;
    return token;
  }

  Future<bool> verifyToken(String token) async {
    return await _authService.verifyToken(token);
  }
}