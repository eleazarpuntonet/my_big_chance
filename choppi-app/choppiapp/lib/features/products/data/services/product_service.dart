import 'package:dio/dio.dart';
import '../models/product_models.dart';

class ProductService {
  final Dio _dio = Dio(BaseOptions(
    baseUrl: 'http://18.218.246.134/api',
    connectTimeout: const Duration(seconds: 10),
    receiveTimeout: const Duration(seconds: 10),
  ));

  ProductService() {
    _dio.interceptors.add(LogInterceptor(requestBody: true, responseBody: true));
  }

  Future<ProductsResponse> getProducts({String? query, int page = 1, int limit = 10}) async {
    try {
      final response = await _dio.get(
        '/products',
        queryParameters: {
          if (query != null) 'q': query,
          'page': page,
          'limit': limit,
        },
      );

      if (response.statusCode == 200) {
        return ProductsResponse.fromJson(response.data);
      } else {
        throw Exception('Failed to load products: ${response.statusMessage}');
      }
    } on DioException catch (e) {
      throw Exception('Network error: ${e.message}');
    }
  }

  Future<Product> getProduct(String id) async {
    try {
      final response = await _dio.get('/products/$id');

      if (response.statusCode == 200) {
        return Product.fromJson(response.data);
      } else {
        throw Exception('Failed to load product: ${response.statusMessage}');
      }
    } on DioException catch (e) {
      throw Exception('Network error: ${e.message}');
    }
  }

  Future<Product> createProduct(CreateProductRequest request) async {
    try {
      final response = await _dio.post(
        '/products',
        data: request.toJson(),
      );

      if (response.statusCode == 201) {
        return Product.fromJson(response.data);
      } else {
        throw Exception('Failed to create product: ${response.statusMessage}');
      }
    } on DioException catch (e) {
      throw Exception('Network error: ${e.message}');
    }
  }

  Future<void> addProductToStore(String storeId, AddProductToStoreRequest request) async {
    try {
      final response = await _dio.post(
        '/stores/$storeId/products',
        data: request.toJson(),
      );

      if (response.statusCode != 201) {
        throw Exception('Failed to add product to store: ${response.statusMessage}');
      }
    } on DioException catch (e) {
      throw Exception('Network error: ${e.message}');
    }
  }
}