import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../data/repositories/product_repository.dart';
import '../data/models/product_models.dart';

// Estados
abstract class ProductState extends Equatable {
  const ProductState();

  @override
  List<Object> get props => [];
}

class ProductInitial extends ProductState {}

class ProductLoading extends ProductState {}

class ProductsLoaded extends ProductState {
  final List<Product> products;
  final int total;
  final int page;
  final int limit;

  const ProductsLoaded(this.products, this.total, this.page, this.limit);

  @override
  List<Object> get props => [products, total, page, limit];
}

class ProductLoaded extends ProductState {
  final Product product;

  const ProductLoaded(this.product);

  @override
  List<Object> get props => [product];
}

class ProductCreated extends ProductState {
  final Product product;

  const ProductCreated(this.product);

  @override
  List<Object> get props => [product];
}

class ProductAddedToStore extends ProductState {}

class ProductError extends ProductState {
  final String message;

  const ProductError(this.message);

  @override
  List<Object> get props => [message];
}

// Eventos
abstract class ProductEvent extends Equatable {
  const ProductEvent();

  @override
  List<Object> get props => [];
}

class LoadProducts extends ProductEvent {
  final String? query;
  final int page;
  final int limit;

  const LoadProducts({this.query, this.page = 1, this.limit = 10});

  @override
  List<Object> get props => [query ?? '', page, limit];
}

class LoadProduct extends ProductEvent {
  final String id;

  const LoadProduct(this.id);

  @override
  List<Object> get props => [id];
}

class CreateProduct extends ProductEvent {
  final CreateProductRequest request;

  const CreateProduct(this.request);

  @override
  List<Object> get props => [request];
}

class AddProductToStore extends ProductEvent {
  final String storeId;
  final AddProductToStoreRequest request;

  const AddProductToStore(this.storeId, this.request);

  @override
  List<Object> get props => [storeId, request];
}

// Bloc
class ProductBloc extends Bloc<ProductEvent, ProductState> {
  final ProductRepository _productRepository;

  ProductBloc(this._productRepository) : super(ProductInitial()) {
    on<LoadProducts>(_onLoadProducts);
    on<LoadProduct>(_onLoadProduct);
    on<CreateProduct>(_onCreateProduct);
    on<AddProductToStore>(_onAddProductToStore);
  }

  Future<void> _onLoadProducts(LoadProducts event, Emitter<ProductState> emit) async {
    emit(ProductLoading());
    try {
      final response = await _productRepository.getProducts(
        query: event.query,
        page: event.page,
        limit: event.limit,
      );
      emit(ProductsLoaded(response.data, response.total, response.page, response.limit));
    } catch (e) {
      emit(ProductError(e.toString()));
    }
  }

  Future<void> _onLoadProduct(LoadProduct event, Emitter<ProductState> emit) async {
    emit(ProductLoading());
    try {
      final product = await _productRepository.getProduct(event.id);
      emit(ProductLoaded(product));
    } catch (e) {
      emit(ProductError(e.toString()));
    }
  }

  Future<void> _onCreateProduct(CreateProduct event, Emitter<ProductState> emit) async {
    emit(ProductLoading());
    try {
      final product = await _productRepository.createProduct(event.request);
      emit(ProductCreated(product));
    } catch (e) {
      emit(ProductError(e.toString()));
    }
  }

  Future<void> _onAddProductToStore(AddProductToStore event, Emitter<ProductState> emit) async {
    emit(ProductLoading());
    try {
      await _productRepository.addProductToStore(event.storeId, event.request);
      emit(ProductAddedToStore());
    } catch (e) {
      emit(ProductError(e.toString()));
    }
  }
}