import { StoreRepository } from '../repositories/storeRepository'
import { Store, StoreProduct, CreateStoreDto, UpdateStoreDto, GetStoresQueryDto, GetStoreProductsQueryDto, StoresResponse, StoreProductsResponse } from '../types/store.types'

export class StoreService {
  static async fetchStores(query: GetStoresQueryDto = {}): Promise<StoresResponse> {
    try {
      const response = await StoreRepository.getStores(query)
      // Business logic: filter active stores, transform data, etc.
      return {
        ...response,
        data: response.data.filter(store => store.isActive), // Example: only active stores
      }
    } catch (error) {
      console.error('Error fetching stores:', error)
      throw error
    }
  }

  static async fetchStore(id: string): Promise<Store> {
    try {
      const store = await StoreRepository.getStore(id)
      // Business logic: validate store, transform data
      if (!store.isActive) {
        throw new Error('Store is not active')
      }
      return store
    } catch (error) {
      console.error('Error fetching store:', error)
      throw error
    }
  }

  static async fetchStoreProducts(storeId: string, query: GetStoreProductsQueryDto = {}): Promise<StoreProductsResponse> {
    try {
      const response = await StoreRepository.getStoreProducts(storeId, query)
      // Business logic: filter by stock if requested, transform data
      let filteredData = response.data

      if (query.inStock === true) {
        filteredData = filteredData.filter(item => item.stock > 0)
      }

      return {
        ...response,
        data: filteredData,
        total: filteredData.length, // Recalculate total after filtering
      }
    } catch (error) {
      console.error('Error fetching store products:', error)
      throw error
    }
  }

  static async createStore(data: CreateStoreDto): Promise<Store> {
    try {
      // Business logic: validate data, transform before sending
      const store = await StoreRepository.createStore(data)
      return store
    } catch (error) {
      console.error('Error creating store:', error)
      throw error
    }
  }

  static async updateStore(id: string, data: UpdateStoreDto): Promise<Store> {
    try {
      // Business logic: validate data
      const store = await StoreRepository.updateStore(id, data)
      return store
    } catch (error) {
      console.error('Error updating store:', error)
      throw error
    }
  }

  static async deleteStore(id: string): Promise<void> {
    try {
      await StoreRepository.deleteStore(id)
    } catch (error) {
      console.error('Error deleting store:', error)
      throw error
    }
  }
}