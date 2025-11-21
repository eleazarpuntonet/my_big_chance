import { create } from 'zustand'
import { Product, GetProductsQueryDto, ProductsResponse, CreateProductDto, UpdateProductDto } from '../types/product.types'
import { ProductService } from '../services/productService'

interface ProductState {
  // State
  products: Product[]
  currentProduct: Product | null
  loading: boolean
  error: string | null
  pagination: {
    total: number
    page: number
    limit: number
  }

  // Actions
  fetchProducts: (query?: GetProductsQueryDto) => Promise<void>
  fetchProduct: (id: string) => Promise<void>
  createProduct: (data: CreateProductDto) => Promise<Product>
  updateProduct: (id: string, data: UpdateProductDto) => Promise<Product>
  deleteProduct: (id: string) => Promise<void>
  clearError: () => void
  setCurrentProduct: (product: Product | null) => void
}

export const useProductStore = create<ProductState>((set, get) => ({
  // Initial state
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
  },

  // Actions
  fetchProducts: async (query = {}) => {
    set({ loading: true, error: null })
    try {
      const response: ProductsResponse = await ProductService.fetchProducts(query)
      set({
        products: response.data,
        pagination: {
          total: response.total,
          page: response.page,
          limit: response.limit,
        },
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch products',
        loading: false,
      })
    }
  },

  fetchProduct: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const product = await ProductService.fetchProduct(id)
      set({ currentProduct: product, loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch product',
        loading: false,
      })
    }
  },

  createProduct: async (data: CreateProductDto) => {
    set({ loading: true, error: null })
    try {
      const product = await ProductService.createProduct(data)
      set(state => ({
        products: [product, ...state.products],
        loading: false,
      }))
      return product
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create product',
        loading: false,
      })
      throw error
    }
  },

  updateProduct: async (id: string, data: UpdateProductDto) => {
    set({ loading: true, error: null })
    try {
      const product = await ProductService.updateProduct(id, data)
      set(state => ({
        products: state.products.map(p => p.id === id ? product : p),
        currentProduct: state.currentProduct?.id === id ? product : state.currentProduct,
        loading: false,
      }))
      return product
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update product',
        loading: false,
      })
      throw error
    }
  },

  deleteProduct: async (id: string) => {
    set({ loading: true, error: null })
    try {
      await ProductService.deleteProduct(id)
      set(state => ({
        products: state.products.filter(p => p.id !== id),
        currentProduct: state.currentProduct?.id === id ? null : state.currentProduct,
        loading: false,
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete product',
        loading: false,
      })
      throw error
    }
  },

  clearError: () => set({ error: null }),

  setCurrentProduct: (product: Product | null) => set({ currentProduct: product }),
}))