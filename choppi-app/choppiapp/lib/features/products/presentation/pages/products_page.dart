import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../bloc/product_bloc.dart';
import '../widgets/product_card.dart';

class ProductsPage extends StatefulWidget {
  const ProductsPage({super.key});

  @override
  State<ProductsPage> createState() => _ProductsPageState();
}

class _ProductsPageState extends State<ProductsPage> {
  final TextEditingController _searchController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  bool _isLoadingMore = false;
  bool _hasMoreData = true;

  @override
  void initState() {
    super.initState();
    context.read<ProductBloc>().add(const LoadProducts());
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _searchController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _onSearchChanged(String query) {
    context.read<ProductBloc>().add(LoadProducts(query: query.isEmpty ? null : query));
  }

  void _onScroll() {
    if (_scrollController.position.pixels == _scrollController.position.maxScrollExtent &&
        !_isLoadingMore &&
        _hasMoreData) {
      _loadMoreProducts();
    }
  }

  void _loadMoreProducts() {
    final currentState = context.read<ProductBloc>().state;
    if (currentState is ProductsLoaded) {
      final nextPage = currentState.page + 1;
      final totalPages = (currentState.total / currentState.limit).ceil();

      if (nextPage <= totalPages) {
        setState(() {
          _isLoadingMore = true;
        });

        context.read<ProductBloc>().add(LoadProducts(
          query: _searchController.text.isEmpty ? null : _searchController.text,
          page: nextPage,
          limit: currentState.limit,
        ));
      } else {
        setState(() {
          _hasMoreData = false;
        });
      }
    }
  }

  Future<void> _onRefresh() async {
    _searchController.clear();
    setState(() {
      _hasMoreData = true;
      _isLoadingMore = false;
    });
    context.read<ProductBloc>().add(const LoadProducts());
    await Future.delayed(const Duration(milliseconds: 500));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Productos Choppi'),
        leading: IconButton(
          icon: const Icon(Icons.home),
          onPressed: () => context.go('/'),
          tooltip: 'Inicio',
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.store),
            onPressed: () => context.go('/'),
            tooltip: 'Ver tiendas',
          ),
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => context.go('/products/create'),
            tooltip: 'Crear producto',
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
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
          ),
          Expanded(
            child: BlocConsumer<ProductBloc, ProductState>(
              listener: (context, state) {
                if (state is ProductsLoaded && _isLoadingMore) {
                  setState(() {
                    _isLoadingMore = false;
                  });
                }
              },
              builder: (context, state) {
                if (state is ProductLoading && !_isLoadingMore) {
                  return const Center(child: CircularProgressIndicator());
                } else if (state is ProductsLoaded) {
                  if (state.products.isEmpty) {
                    return RefreshIndicator(
                      onRefresh: _onRefresh,
                      child: SingleChildScrollView(
                        physics: const AlwaysScrollableScrollPhysics(),
                        child: SizedBox(
                          height: MediaQuery.of(context).size.height * 0.6,
                          child: const Center(child: Text('No se encontraron productos')),
                        ),
                      ),
                    );
                  }

                  return RefreshIndicator(
                    onRefresh: _onRefresh,
                    child: GridView.builder(
                      controller: _scrollController,
                      physics: const AlwaysScrollableScrollPhysics(),
                      padding: const EdgeInsets.all(16),
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        childAspectRatio: 0.75,
                        crossAxisSpacing: 16,
                        mainAxisSpacing: 16,
                      ),
                      itemCount: state.products.length + (_isLoadingMore ? 1 : 0),
                      itemBuilder: (context, index) {
                        if (index == state.products.length) {
                          return const Center(child: CircularProgressIndicator());
                        }

                        final product = state.products[index];
                        return ProductCard(
                          product: product,
                          onTap: () => context.go('/products/${product.id}'),
                        );
                      },
                    ),
                  );
                } else if (state is ProductError) {
                  return RefreshIndicator(
                    onRefresh: _onRefresh,
                    child: SingleChildScrollView(
                      physics: const AlwaysScrollableScrollPhysics(),
                      child: SizedBox(
                        height: MediaQuery.of(context).size.height * 0.6,
                        child: Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.error, size: 64, color: Colors.red),
                              const SizedBox(height: 16),
                              Text('Error: ${state.message}'),
                              const SizedBox(height: 16),
                              ElevatedButton(
                                onPressed: _onRefresh,
                                child: const Text('Reintentar'),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  );
                }
                return RefreshIndicator(
                  onRefresh: _onRefresh,
                  child: SingleChildScrollView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    child: SizedBox(
                      height: MediaQuery.of(context).size.height * 0.6,
                      child: const Center(child: Text('¡Bienvenido a Choppi!\n\nDesliza hacia abajo para recargar')),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}