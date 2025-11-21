import { create } from 'zustand'
import { Store, StoreProduct, GetStoresQueryDto, GetStoreProductsQueryDto, StoresResponse, StoreProductsResponse, CreateStoreDto, UpdateStoreDto } from '../types/store.types'
import { StoreService } from '../services/storeService'

interface StoreState {
  // State
  stores: Store[]
  currentStore: Store | null
  storeProducts: StoreProduct[]
  loading: boolean
  error: string | null
  storesPagination: {
    total: number
    page: number
    limit: number
  }
  productsPagination: {
    total: number
    page: number
    limit: number
  }

  // Actions
  fetchStores: (query?: GetStoresQueryDto) => Promise<void>
  fetchStore: (id: string) => Promise<void>
  fetchStoreProducts: (storeId: string, query?: GetStoreProductsQueryDto) => Promise<void>
  createStore: (data: CreateStoreDto) => Promise<Store>
  updateStore: (id: string, data: UpdateStoreDto) => Promise<Store>
  deleteStore: (id: string) => Promise<void>
  clearError: () => void
  setCurrentStore: (store: Store | null) => void
  setStoreProducts: (products: StoreProduct[]) => void
}

export const useStoreStore = create<StoreState>((set, get) => ({
  // Initial state
  stores: [],
  currentStore: null,
  storeProducts: [],
  loading: false,
  error: null,
  storesPagination: {
    total: 0,
    page: 1,
    limit: 10,
  },
  productsPagination: {
    total: 0,
    page: 1,
    limit: 10,
  },

  // Actions
  fetchStores: async (query = {}) => {
    set({ loading: true, error: null })
    try {
      const response: StoresResponse = await StoreService.fetchStores(query)
      set({
        stores: response.data,
        storesPagination: {
          total: response.total,
          page: response.page,
          limit: response.limit,
        },
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch stores',
        loading: false,
      })
    }
  },

  fetchStore: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const store = await StoreService.fetchStore(id)
      set({ currentStore: store, loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch store',
        loading: false,
      })
    }
  },

  fetchStoreProducts: async (storeId: string, query = {}) => {
    set({ loading: true, error: null })
    try {
      const response: StoreProductsResponse = await StoreService.fetchStoreProducts(storeId, query)
      set({
        storeProducts: response.data,
        productsPagination: {
          total: response.total,
          page: response.page,
          limit: response.limit,
        },
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch store products',
        loading: false,
      })
    }
  },

  createStore: async (data: CreateStoreDto) => {
    set({ loading: true, error: null })
    try {
      const store = await StoreService.createStore(data)
      set(state => ({
        stores: [store, ...state.stores],
        loading: false,
      }))
      return store
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create store',
        loading: false,
      })
      throw error
    }
  },

  updateStore: async (id: string, data: UpdateStoreDto) => {
    set({ loading: true, error: null })
    try {
      const store = await StoreService.updateStore(id, data)
      set(state => ({
        stores: state.stores.map(s => s.id === id ? store : s),
        currentStore: state.currentStore?.id === id ? store : state.currentStore,
        loading: false,
      }))
      return store
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update store',
        loading: false,
      })
      throw error
    }
  },

  deleteStore: async (id: string) => {
    set({ loading: true, error: null })
    try {
      await StoreService.deleteStore(id)
      set(state => ({
        stores: state.stores.filter(s => s.id !== id),
        currentStore: state.currentStore?.id === id ? null : state.currentStore,
        loading: false,
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete store',
        loading: false,
      })
      throw error
    }
  },

  clearError: () => set({ error: null }),

  setCurrentStore: (store: Store | null) => set({ currentStore: store }),

  setStoreProducts: (products: StoreProduct[]) => set({ storeProducts: products }),
}))