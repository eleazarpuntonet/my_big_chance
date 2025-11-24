import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../data/repositories/auth_repository.dart';
import '../data/services/auth_service.dart';

// Estados del AuthBloc
abstract class AuthState extends Equatable {
  const AuthState();

  @override
  List<Object> get props => [];
}

class AuthInitial extends AuthState {}

class AuthLoading extends AuthState {}

class AuthAuthenticated extends AuthState {
  final String token;

  const AuthAuthenticated(this.token);

  @override
  List<Object> get props => [token];
}

class AuthError extends AuthState {
  final String message;
  final String? error;
  final int? statusCode;

  const AuthError(this.message, {this.error, this.statusCode});

  @override
  List<Object> get props => [message, error ?? '', statusCode ?? 0];
}

// Eventos del AuthBloc (aunque usamos Cubit, podemos definir eventos para claridad)
abstract class AuthEvent {}

class LoginRequested extends AuthEvent {
  final String email;
  final String password;

  LoginRequested(this.email, this.password);
}

class LogoutRequested extends AuthEvent {}

// AuthCubit (usando Cubit en lugar de Bloc para simplicidad)
class AuthBloc extends Cubit<AuthState> {
  final AuthRepository _authRepository;

  AuthBloc(this._authRepository) : super(AuthInitial());

  Future<void> login(String email, String password) async {
    emit(AuthLoading());
    try {
      final token = await _authRepository.login(email, password);
      emit(AuthAuthenticated(token));
    } catch (e) {
      // Mejorar el manejo de AuthException
      if (e is AuthException) {
        emit(AuthError(
          e.userFriendlyMessage,
          error: e.error,
          statusCode: e.statusCode,
        ));
      } else {
        emit(AuthError(e.toString()));
      }
    }
  }

  void logout() {
    emit(AuthInitial());
  }
}