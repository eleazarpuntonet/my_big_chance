import '../models/store_models.dart';
import '../services/store_service.dart';

class StoreRepository {
  final StoreService _storeService;

  StoreRepository(this._storeService);

  Future<StoresResponse> getStores({String? query, int page = 1, int limit = 10}) async {
    return await _storeService.getStores(query: query, page: page, limit: limit);
  }

  Future<Store> getStore(String id) async {
    return await _storeService.getStore(id);
  }

  Future<StoreProductsResponse> getStoreProducts(
    String storeId, {
    String? query,
    bool? inStock,
    int page = 1,
    int limit = 10,
  }) async {
    return await _storeService.getStoreProducts(
      storeId,
      query: query,
      inStock: inStock,
      page: page,
      limit: limit,
    );
  }
}