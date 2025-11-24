import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../bloc/store_bloc.dart';
import '../../data/models/store_models.dart';

class StoresPage extends StatefulWidget {
  const StoresPage({super.key});

  @override
  State<StoresPage> createState() => _StoresPageState();
}

class _StoresPageState extends State<StoresPage> {
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    context.read<StoreBloc>().add(const LoadStores());
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _onSearchChanged(String query) {
    context.read<StoreBloc>().add(LoadStores(query: query.isEmpty ? null : query));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Stores'),
        actions: [
          IconButton(
            icon: const Icon(Icons.login),
            onPressed: () => context.go('/login'),
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
                labelText: 'Search stores',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              onChanged: _onSearchChanged,
            ),
          ),
          Expanded(
            child: BlocBuilder<StoreBloc, StoreState>(
              builder: (context, state) {
                if (state is StoreLoading) {
                  return const Center(child: CircularProgressIndicator());
                } else if (state is StoresLoaded) {
                  if (state.stores.isEmpty) {
                    return const Center(child: Text('No stores found'));
                  }
                  return ListView.builder(
                    itemCount: state.stores.length,
                    itemBuilder: (context, index) {
                      final store = state.stores[index];
                      return Card(
                        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        child: ListTile(
                          title: Text(store.name),
                          subtitle: store.description != null ? Text(store.description!) : null,
                          trailing: const Icon(Icons.arrow_forward),
                          onTap: () => context.go('/stores/${store.id}'),
                        ),
                      );
                    },
                  );
                } else if (state is StoreError) {
                  return Center(child: Text('Error: ${state.message}'));
                }
                return const Center(child: Text('Welcome to Choppi!'));
              },
            ),
          ),
        ],
      ),
    );
  }
}