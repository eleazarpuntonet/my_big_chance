import 'package:dio/dio.dart';
import '../models/store_models.dart';

class StoreService {
  final Dio _dio = Dio(BaseOptions(
    baseUrl: 'http://18.218.246.134/api',
    connectTimeout: const Duration(seconds: 10),
    receiveTimeout: const Duration(seconds: 10),
  ));

  StoreService() {
    _dio.interceptors.add(LogInterceptor(requestBody: true, responseBody: true));
  }

  Future<StoresResponse> getStores({String? query, int page = 1, int limit = 10}) async {
    try {
      final response = await _dio.get(
        '/stores',
        queryParameters: {
          if (query != null) 'q': query,
          'page': page,
          'limit': limit,
        },
      );

      if (response.statusCode == 200) {
        return StoresResponse.fromJson(response.data);
      } else {
        throw Exception('Failed to load stores: ${response.statusMessage}');
      }
    } on DioException catch (e) {
      throw Exception('Network error: ${e.message}');
    }
  }

  Future<Store> getStore(String id) async {
    try {
      final response = await _dio.get('/stores/$id');

      if (response.statusCode == 200) {
        return Store.fromJson(response.data);
      } else {
        throw Exception('Failed to load store: ${response.statusMessage}');
      }
    } on DioException catch (e) {
      throw Exception('Network error: ${e.message}');
    }
  }

  Future<StoreProductsResponse> getStoreProducts(
    String storeId, {
    String? query,
    bool? inStock,
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final response = await _dio.get(
        '/stores/$storeId/products',
        queryParameters: {
          if (query != null) 'q': query,
          if (inStock != null) 'inStock': inStock,
          'page': page,
          'limit': limit,
        },
      );

      if (response.statusCode == 200) {
        return StoreProductsResponse.fromJson(response.data);
      } else {
        throw Exception('Failed to load store products: ${response.statusMessage}');
      }
    } on DioException catch (e) {
      throw Exception('Network error: ${e.message}');
    }
  }
}