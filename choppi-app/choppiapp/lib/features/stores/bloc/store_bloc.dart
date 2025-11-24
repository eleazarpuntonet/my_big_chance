import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../data/repositories/store_repository.dart';
import '../data/models/store_models.dart';

// Estados
abstract class StoreState extends Equatable {
  const StoreState();

  @override
  List<Object> get props => [];
}

class StoreInitial extends StoreState {}

class StoreLoading extends StoreState {}

class StoresLoaded extends StoreState {
  final List<Store> stores;
  final int total;
  final int page;
  final int limit;

  const StoresLoaded(this.stores, this.total, this.page, this.limit);

  @override
  List<Object> get props => [stores, total, page, limit];
}

class StoreLoaded extends StoreState {
  final Store store;

  const StoreLoaded(this.store);

  @override
  List<Object> get props => [store];
}

class StoreProductsLoaded extends StoreState {
  final List<StoreProduct> products;
  final int total;
  final int page;
  final int limit;

  const StoreProductsLoaded(this.products, this.total, this.page, this.limit);

  @override
  List<Object> get props => [products, total, page, limit];
}

class StoreError extends StoreState {
  final String message;

  const StoreError(this.message);

  @override
  List<Object> get props => [message];
}

// Eventos
abstract class StoreEvent extends Equatable {
  const StoreEvent();

  @override
  List<Object> get props => [];
}

class LoadStores extends StoreEvent {
  final String? query;
  final int page;
  final int limit;

  const LoadStores({this.query, this.page = 1, this.limit = 10});

  @override
  List<Object> get props => [query ?? '', page, limit];
}

class LoadStore extends StoreEvent {
  final String id;

  const LoadStore(this.id);

  @override
  List<Object> get props => [id];
}

class LoadStoreProducts extends StoreEvent {
  final String storeId;
  final String? query;
  final bool? inStock;
  final int page;
  final int limit;

  const LoadStoreProducts(
    this.storeId, {
    this.query,
    this.inStock,
    this.page = 1,
    this.limit = 10,
  });

  @override
  List<Object> get props => [storeId, query ?? '', inStock ?? false, page, limit];
}

// Bloc
class StoreBloc extends Bloc<StoreEvent, StoreState> {
  final StoreRepository _storeRepository;

  StoreBloc(this._storeRepository) : super(StoreInitial()) {
    on<LoadStores>(_onLoadStores);
    on<LoadStore>(_onLoadStore);
    on<LoadStoreProducts>(_onLoadStoreProducts);
  }

  Future<void> _onLoadStores(LoadStores event, Emitter<StoreState> emit) async {
    emit(StoreLoading());
    try {
      final response = await _storeRepository.getStores(
        query: event.query,
        page: event.page,
        limit: event.limit,
      );
      emit(StoresLoaded(response.data, response.total, response.page, response.limit));
    } catch (e) {
      emit(StoreError(e.toString()));
    }
  }

  Future<void> _onLoadStore(LoadStore event, Emitter<StoreState> emit) async {
    emit(StoreLoading());
    try {
      final store = await _storeRepository.getStore(event.id);
      emit(StoreLoaded(store));
    } catch (e) {
      emit(StoreError(e.toString()));
    }
  }

  Future<void> _onLoadStoreProducts(LoadStoreProducts event, Emitter<StoreState> emit) async {
    emit(StoreLoading());
    try {
      final response = await _storeRepository.getStoreProducts(
        event.storeId,
        query: event.query,
        inStock: event.inStock,
        page: event.page,
        limit: event.limit,
      );
      emit(StoreProductsLoaded(response.data, response.total, response.page, response.limit));
    } catch (e) {
      emit(StoreError(e.toString()));
    }
  }
}