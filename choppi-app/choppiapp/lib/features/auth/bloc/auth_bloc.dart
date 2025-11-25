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

// Eventos del AuthBloc
abstract class AuthEvent extends Equatable {
  const AuthEvent();

  @override
  List<Object> get props => [];
}

class LoginRequested extends AuthEvent {
  final String email;
  final String password;

  const LoginRequested(this.email, this.password);

  @override
  List<Object> get props => [email, password];
}

class RegisterRequested extends AuthEvent {
  final String email;
  final String password;

  const RegisterRequested(this.email, this.password);

  @override
  List<Object> get props => [email, password];
}

class LogoutRequested extends AuthEvent {}

// AuthBloc usando Bloc
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final AuthRepository _authRepository;

  AuthBloc(this._authRepository) : super(AuthInitial()) {
    on<LoginRequested>(_onLoginRequested);
    on<RegisterRequested>(_onRegisterRequested);
    on<LogoutRequested>(_onLogoutRequested);
  }

  Future<void> _onLoginRequested(LoginRequested event, Emitter<AuthState> emit) async {
    emit(AuthLoading());
    try {
      final token = await _authRepository.login(event.email, event.password);
      emit(AuthAuthenticated(token));
    } catch (e) {
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

  Future<void> _onRegisterRequested(RegisterRequested event, Emitter<AuthState> emit) async {
    emit(AuthLoading());
    try {
      final token = await _authRepository.register(event.email, event.password);
      emit(AuthAuthenticated(token));
    } catch (e) {
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

  void _onLogoutRequested(LogoutRequested event, Emitter<AuthState> emit) {
    emit(AuthInitial());
  }

  // Métodos convenientes para usar desde la UI
  void login(String email, String password) {
    add(LoginRequested(email, password));
  }

  void register(String email, String password) {
    add(RegisterRequested(email, password));
  }

  void logout() {
    add(LogoutRequested());
  }
}