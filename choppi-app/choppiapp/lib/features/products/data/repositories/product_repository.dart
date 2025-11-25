import '../models/product_models.dart';
import '../services/product_service.dart';

class ProductRepository {
  final ProductService _productService;

  ProductRepository(this._productService);

  Future<ProductsResponse> getProducts({String? query, int page = 1, int limit = 10}) async {
    return await _productService.getProducts(query: query, page: page, limit: limit);
  }

  Future<Product> getProduct(String id) async {
    return await _productService.getProduct(id);
  }

  Future<Product> createProduct(CreateProductRequest request) async {
    return await _productService.createProduct(request);
  }

  Future<void> addProductToStore(String storeId, AddProductToStoreRequest request) async {
    return await _productService.addProductToStore(storeId, request);
  }
}