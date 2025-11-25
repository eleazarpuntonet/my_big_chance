// Modelo para Product
class Product {
  final String id;
  final String name;
  final String? description;
  final double? basePrice;
  final String? category;
  final String? imageUrl;
  final bool isActive;
  final DateTime createdAt;
  final DateTime updatedAt;

  Product({
    required this.id,
    required this.name,
    this.description,
    this.basePrice,
    this.category,
    this.imageUrl,
    required this.isActive,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    double _toDouble(dynamic value) {
      if (value is double) return value;
      if (value is int) return value.toDouble();
      if (value is String) return double.tryParse(value) ?? 0.0;
      return 0.0;
    }

    return Product(
      id: json['id'],
      name: json['name'],
      description: json['description'],
      basePrice: json['basePrice'] != null ? _toDouble(json['basePrice']) : null,
      category: json['category'],
      imageUrl: json['imageUrl'],
      isActive: json['isActive'] ?? true,
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'basePrice': basePrice,
      'category': category,
      'imageUrl': imageUrl,
      'isActive': isActive,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}

// Modelo para crear un producto
class CreateProductRequest {
  final String name;
  final String? description;
  final double? basePrice;
  final String? category;
  final String? imageUrl;

  CreateProductRequest({
    required this.name,
    this.description,
    this.basePrice,
    this.category,
    this.imageUrl,
  });

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'description': description,
      'basePrice': basePrice,
      'category': category,
      'imageUrl': imageUrl,
    };
  }
}

// Modelo para agregar producto a tienda
class AddProductToStoreRequest {
  final String productId;
  final double price;
  final int stock;

  AddProductToStoreRequest({
    required this.productId,
    required this.price,
    required this.stock,
  });

  Map<String, dynamic> toJson() {
    return {
      'productId': productId,
      'price': price,
      'stock': stock,
    };
  }
}

// Modelo para la respuesta paginada de products
class ProductsResponse {
  final List<Product> data;
  final int total;
  final int page;
  final int limit;

  ProductsResponse({
    required this.data,
    required this.total,
    required this.page,
    required this.limit,
  });

  factory ProductsResponse.fromJson(Map<String, dynamic> json) {
    int _toInt(dynamic value) {
      if (value is int) return value;
      if (value is double) return value.toInt();
      if (value is String) return int.tryParse(value) ?? 0;
      return 0;
    }

    return ProductsResponse(
      data: (json['data'] as List).map((item) => Product.fromJson(item)).toList(),
      total: _toInt(json['total']),
      page: _toInt(json['page']),
      limit: _toInt(json['limit']),
    );
  }
}