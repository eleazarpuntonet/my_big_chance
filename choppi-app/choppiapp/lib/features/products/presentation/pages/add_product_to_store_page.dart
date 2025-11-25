import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../bloc/product_bloc.dart';
import '../../data/models/product_models.dart';

class AddProductToStorePage extends StatefulWidget {
  final String storeId;

  const AddProductToStorePage({super.key, required this.storeId});

  @override
  State<AddProductToStorePage> createState() => _AddProductToStorePageState();
}

class _AddProductToStorePageState extends State<AddProductToStorePage> {
  final TextEditingController _searchController = TextEditingController();
  final TextEditingController _priceController = TextEditingController();
  final TextEditingController _stockController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  Product? _selectedProduct;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    context.read<ProductBloc>().add(const LoadProducts());
  }

  @override
  void dispose() {
    _searchController.dispose();
    _priceController.dispose();
    _stockController.dispose();
    super.dispose();
  }

  void _onSearchChanged(String query) {
    context.read<ProductBloc>().add(LoadProducts(query: query.isEmpty ? null : query));
  }

  void _selectProduct(Product product) {
    setState(() {
      _selectedProduct = product;
      // Pre-llenar el precio con el precio base si existe
      if (product.basePrice != null) {
        _priceController.text = product.basePrice!.toStringAsFixed(2);
      }
    });
  }

  void _submitForm() {
    if (_formKey.currentState!.validate() && _selectedProduct != null) {
      final request = AddProductToStoreRequest(
        productId: _selectedProduct!.id,
        price: double.parse(_priceController.text),
        stock: int.parse(_stockController.text),
      );

      context.read<ProductBloc>().add(AddProductToStore(widget.storeId, request));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Agregar Producto a Tienda'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.go('/stores/${widget.storeId}'),
          tooltip: 'Volver a tienda',
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
        ],
      ),
      body: BlocConsumer<ProductBloc, ProductState>(
        listener: (context, state) {
          if (state is ProductAddedToStore) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Producto agregado exitosamente a la tienda'),
                backgroundColor: Colors.green,
              ),
            );
            // Limpiar formulario y volver
            setState(() {
              _selectedProduct = null;
            });
            _priceController.clear();
            _stockController.clear();
            context.go('/stores/${widget.storeId}');
          } else if (state is ProductError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('Error: ${state.message}'),
                backgroundColor: Colors.red,
              ),
            );
          } else if (state is ProductLoading) {
            setState(() {
              _isLoading = true;
            });
          } else {
            setState(() {
              _isLoading = false;
            });
          }
        },
        builder: (context, state) {
          return Column(
            children: [
              // Formulario para agregar producto
              if (_selectedProduct != null)
                Container(
                  padding: const EdgeInsets.all(16),
                  color: Colors.blue[50],
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.check_circle, color: Colors.green),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                'Producto seleccionado: ${_selectedProduct!.name}',
                                style: const TextStyle(fontWeight: FontWeight.bold),
                              ),
                            ),
                            IconButton(
                              icon: const Icon(Icons.clear),
                              onPressed: () {
                                setState(() {
                                  _selectedProduct = null;
                                });
                                _priceController.clear();
                                _stockController.clear();
                              },
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            Expanded(
                              child: TextFormField(
                                controller: _priceController,
                                decoration: const InputDecoration(
                                  labelText: 'Precio *',
                                  border: OutlineInputBorder(),
                                  prefixIcon: Icon(Icons.attach_money),
                                ),
                                keyboardType: TextInputType.number,
                                validator: (value) {
                                  if (value == null || value.isEmpty) {
                                    return 'Requerido';
                                  }
                                  final price = double.tryParse(value);
                                  if (price == null || price <= 0) {
                                    return 'Precio inválido';
                                  }
                                  return null;
                                },
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: TextFormField(
                                controller: _stockController,
                                decoration: const InputDecoration(
                                  labelText: 'Stock *',
                                  border: OutlineInputBorder(),
                                  prefixIcon: Icon(Icons.inventory),
                                ),
                                keyboardType: TextInputType.number,
                                validator: (value) {
                                  if (value == null || value.isEmpty) {
                                    return 'Requerido';
                                  }
                                  final stock = int.tryParse(value);
                                  if (stock == null || stock < 0) {
                                    return 'Stock inválido';
                                  }
                                  return null;
                                },
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        SizedBox(
                          width: double.infinity,
                          height: 45,
                          child: ElevatedButton(
                            onPressed: _isLoading ? null : _submitForm,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.green,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                            child: _isLoading
                                ? const CircularProgressIndicator(color: Colors.white)
                                : const Text('Agregar a Tienda'),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

              // Buscador de productos
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: TextField(
                  controller: _searchController,
                  decoration: InputDecoration(
                    labelText: 'Buscar productos disponibles',
                    prefixIcon: const Icon(Icons.search),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  onChanged: _onSearchChanged,
                ),
              ),

              // Lista de productos
              Expanded(
                child: state is ProductLoading && !_isLoading
                    ? const Center(child: CircularProgressIndicator())
                    : state is ProductsLoaded
                        ? state.products.isEmpty
                            ? const Center(child: Text('No se encontraron productos'))
                            : ListView.builder(
                                itemCount: state.products.length,
                                itemBuilder: (context, index) {
                                  final product = state.products[index];
                                  final isSelected = _selectedProduct?.id == product.id;

                                  return Card(
                                    margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                                    color: isSelected ? Colors.blue[50] : null,
                                    child: ListTile(
                                      leading: isSelected
                                          ? const Icon(Icons.check_circle, color: Colors.green)
                                          : const Icon(Icons.inventory_2),
                                      title: Text(product.name),
                                      subtitle: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          if (product.description != null)
                                            Text(product.description!),
                                          if (product.basePrice != null)
                                            Text('Precio base: \$${product.basePrice!.toStringAsFixed(2)}'),
                                          if (product.category != null)
                                            Text('Categoría: ${product.category}'),
                                        ],
                                      ),
                                      trailing: isSelected
                                          ? null
                                          : ElevatedButton(
                                              onPressed: () => _selectProduct(product),
                                              child: const Text('Seleccionar'),
                                            ),
                                      onTap: () => _selectProduct(product),
                                    ),
                                  );
                                },
                              )
                        : state is ProductError
                            ? Center(
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    const Icon(Icons.error, size: 64, color: Colors.red),
                                    const SizedBox(height: 16),
                                    Text('Error: ${state.message}'),
                                    const SizedBox(height: 16),
                                    ElevatedButton(
                                      onPressed: () {
                                        context.read<ProductBloc>().add(const LoadProducts());
                                      },
                                      child: const Text('Reintentar'),
                                    ),
                                  ],
                                ),
                              )
                            : const Center(child: Text('Cargando productos...')),
              ),
            ],
          );
        },
      ),
    );
  }
}