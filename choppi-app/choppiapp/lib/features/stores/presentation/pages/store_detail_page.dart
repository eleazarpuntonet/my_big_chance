import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../bloc/store_bloc.dart';
import '../../data/models/store_models.dart';

class StoreDetailPage extends StatefulWidget {
  final String storeId;

  const StoreDetailPage({super.key, required this.storeId});

  @override
  State<StoreDetailPage> createState() => _StoreDetailPageState();
}

class _StoreDetailPageState extends State<StoreDetailPage> {
  final TextEditingController _searchController = TextEditingController();
  bool _inStockOnly = false;
  Store? _currentStore;
  List<StoreProduct> _currentProducts = [];
  bool _isLoadingStore = true;
  bool _isLoadingProducts = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    // Cargar la tienda y sus productos
    context.read<StoreBloc>().add(LoadStore(widget.storeId));
    context.read<StoreBloc>().add(LoadStoreProducts(widget.storeId));
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _onSearchChanged(String query) {
    context.read<StoreBloc>().add(LoadStoreProducts(
      widget.storeId,
      query: query.isEmpty ? null : query,
      inStock: _inStockOnly,
    ));
  }

  void _onInStockChanged(bool? value) {
    setState(() {
      _inStockOnly = value ?? false;
    });
    context.read<StoreBloc>().add(LoadStoreProducts(
      widget.storeId,
      query: _searchController.text.isEmpty ? null : _searchController.text,
      inStock: _inStockOnly,
    ));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Detalles de la Tienda'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.go('/'),
          tooltip: 'Volver a tiendas',
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.home),
            onPressed: () => context.go('/'),
            tooltip: 'Inicio',
          ),
          IconButton(
            icon: const Icon(Icons.inventory),
            onPressed: () => context.go('/products'),
            tooltip: 'Ver productos',
          ),
          IconButton(
            icon: const Icon(Icons.add_shopping_cart),
            onPressed: () => context.go('/stores/${widget.storeId}/add-product'),
            tooltip: 'Agregar producto',
          ),
        ],
      ),
      body: BlocListener<StoreBloc, StoreState>(
        listener: (context, state) {
          if (state is StoreLoaded) {
            setState(() {
              _currentStore = state.store;
              _isLoadingStore = false;
            });
          } else if (state is StoreProductsLoaded) {
            setState(() {
              _currentProducts = state.products;
              _isLoadingProducts = false;
            });
          } else if (state is StoreError) {
            setState(() {
              _error = state.message;
              _isLoadingStore = false;
              _isLoadingProducts = false;
            });
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Error: ${state.message}')),
            );
          } else if (state is StoreLoading) {
            // Handle loading state if needed
          }
        },
        child: _buildContent(),
      ),
    );
  }

  Widget _buildContent() {
    if (_error != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error, size: 64, color: Colors.red),
            const SizedBox(height: 16),
            Text('Error: $_error'),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                setState(() {
                  _error = null;
                  _isLoadingStore = true;
                  _isLoadingProducts = true;
                });
                context.read<StoreBloc>().add(LoadStore(widget.storeId));
                context.read<StoreBloc>().add(LoadStoreProducts(widget.storeId));
              },
              child: const Text('Reintentar'),
            ),
          ],
        ),
      );
    }

    if (_isLoadingStore) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_currentStore == null) {
      return const Center(child: Text('Tienda no encontrada'));
    }

    return Column(
      children: [
        // Información de la tienda
        Container(
          padding: const EdgeInsets.all(16),
          color: Theme.of(context).primaryColor.withOpacity(0.1),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                _currentStore!.name,
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              if (_currentStore!.description != null)
                Text(_currentStore!.description!),
              if (_currentStore!.address != null)
                Text('Dirección: ${_currentStore!.address}'),
              if (_currentStore!.phone != null)
                Text('Teléfono: ${_currentStore!.phone}'),
            ],
          ),
        ),
        // Filtros
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              TextField(
                controller: _searchController,
                decoration: InputDecoration(
                  labelText: 'Buscar productos',
                  prefixIcon: const Icon(Icons.search),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                onChanged: _onSearchChanged,
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  const Text('Solo en stock'),
                  Checkbox(
                    value: _inStockOnly,
                    onChanged: _onInStockChanged,
                  ),
                ],
              ),
            ],
          ),
        ),
        // Lista de productos
        Expanded(
          child: _isLoadingProducts
              ? const Center(child: CircularProgressIndicator())
              : _currentProducts.isEmpty
                  ? const Center(child: Text('No se encontraron productos'))
                  : ListView.builder(
                      itemCount: _currentProducts.length,
                      itemBuilder: (context, index) {
                        final storeProduct = _currentProducts[index];
                        return Card(
                          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          child: ListTile(
                            title: Text(storeProduct.product.name),
                            subtitle: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Precio: \$${storeProduct.price.toStringAsFixed(2)}'),
                                Text('Stock: ${storeProduct.stock}'),
                                if (storeProduct.product.description != null)
                                  Text(storeProduct.product.description!),
                              ],
                            ),
                            trailing: storeProduct.stock > 0
                                ? const Icon(Icons.check_circle, color: Colors.green)
                                : const Icon(Icons.cancel, color: Colors.red),
                          ),
                        );
                      },
                    ),
        ),
      ],
    );
  }
}