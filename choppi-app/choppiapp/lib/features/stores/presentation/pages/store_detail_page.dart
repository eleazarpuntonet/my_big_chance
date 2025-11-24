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
        title: const Text('Store Details'),
      ),
      body: BlocBuilder<StoreBloc, StoreState>(
        builder: (context, state) {
          if (state is StoreLoading) {
            return const Center(child: CircularProgressIndicator());
          } else if (state is StoreLoaded) {
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
                        state.store.name,
                        style: Theme.of(context).textTheme.headlineSmall,
                      ),
                      if (state.store.description != null)
                        Text(state.store.description!),
                      if (state.store.address != null)
                        Text('Address: ${state.store.address}'),
                      if (state.store.phone != null)
                        Text('Phone: ${state.store.phone}'),
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
                          labelText: 'Search products',
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
                          const Text('In stock only'),
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
                  child: BlocBuilder<StoreBloc, StoreState>(
                    builder: (context, productState) {
                      if (productState is StoreProductsLoaded) {
                        if (productState.products.isEmpty) {
                          return const Center(child: Text('No products found'));
                        }
                        return ListView.builder(
                          itemCount: productState.products.length,
                          itemBuilder: (context, index) {
                            final storeProduct = productState.products[index];
                            return Card(
                              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                              child: ListTile(
                                title: Text(storeProduct.product.name),
                                subtitle: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text('Price: \$${storeProduct.price.toStringAsFixed(2)}'),
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
                        );
                      } else if (productState is StoreError) {
                        return Center(child: Text('Error: ${productState.message}'));
                      }
                      return const Center(child: CircularProgressIndicator());
                    },
                  ),
                ),
              ],
            );
          } else if (state is StoreError) {
            return Center(child: Text('Error: ${state.message}'));
          }
          return const Center(child: Text('Loading store...'));
        },
      ),
    );
  }
}