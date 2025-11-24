// Modelo para Store
class Store {
  final String id;
  final String name;
  final String? description;
  final String? address;
  final String? phone;
  final bool isActive;
  final DateTime createdAt;
  final DateTime updatedAt;

  Store({
    required this.id,
    required this.name,
    this.description,
    this.address,
    this.phone,
    required this.isActive,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Store.fromJson(Map<String, dynamic> json) {
    return Store(
      id: json['id'],
      name: json['name'],
      description: json['description'],
      address: json['address'],
      phone: json['phone'],
      isActive: json['isActive'] ?? true,
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }
}

// Modelo para StoreProduct
class StoreProduct {
  final String id;
  final String storeId;
  final String productId;
  final double price;
  final int stock;
  final bool isActive;
  final DateTime createdAt;
  final DateTime updatedAt;
  final Product product;

  StoreProduct({
    required this.id,
    required this.storeId,
    required this.productId,
    required this.price,
    required this.stock,
    required this.isActive,
    required this.createdAt,
    required this.updatedAt,
    required this.product,
  });

  factory StoreProduct.fromJson(Map<String, dynamic> json) {
    return StoreProduct(
      id: json['id'],
      storeId: json['storeId'],
      productId: json['productId'],
      price: (json['price'] as num).toDouble(),
      stock: json['stock'],
      isActive: json['isActive'] ?? true,
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      product: Product.fromJson(json['product']),
    );
  }
}

// Modelo para Product
class Product {
  final String id;
  final String name;
  final String? description;
  final double? basePrice;
  final String? category;
  final String? imageUrl;
  final bool isActive;

  Product({
    required this.id,
    required this.name,
    this.description,
    this.basePrice,
    this.category,
    this.imageUrl,
    required this.isActive,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'],
      name: json['name'],
      description: json['description'],
      basePrice: json['basePrice'] != null ? (json['basePrice'] as num).toDouble() : null,
      category: json['category'],
      imageUrl: json['imageUrl'],
      isActive: json['isActive'] ?? true,
    );
  }
}

// Modelo para la respuesta paginada de stores
class StoresResponse {
  final List<Store> data;
  final int total;
  final int page;
  final int limit;

  StoresResponse({
    required this.data,
    required this.total,
    required this.page,
    required this.limit,
  });

  factory StoresResponse.fromJson(Map<String, dynamic> json) {
    return StoresResponse(
      data: (json['data'] as List).map((item) => Store.fromJson(item)).toList(),
      total: json['total'],
      page: json['page'],
      limit: json['limit'],
    );
  }
}

// Modelo para la respuesta paginada de store products
class StoreProductsResponse {
  final List<StoreProduct> data;
  final int total;
  final int page;
  final int limit;

  StoreProductsResponse({
    required this.data,
    required this.total,
    required this.page,
    required this.limit,
  });

  factory StoreProductsResponse.fromJson(Map<String, dynamic> json) {
    return StoreProductsResponse(
      data: (json['data'] as List).map((item) => StoreProduct.fromJson(item)).toList(),
      total: json['total'],
      page: json['page'],
      limit: json['limit'],
    );
  }
}