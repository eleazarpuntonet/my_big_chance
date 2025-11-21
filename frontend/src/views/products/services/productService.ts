import { ProductRepository } from '../repositories/productRepository'
import { Product, CreateProductDto, UpdateProductDto, GetProductsQueryDto, ProductsResponse } from '../types/product.types'

export class ProductService {
  static async fetchProducts(query: GetProductsQueryDto = {}): Promise<ProductsResponse> {
    try {
      const response = await ProductRepository.getProducts(query)
      // Business logic: filter active products, transform data, etc.
      return {
        ...response,
        data: response.data.filter(product => product.isActive), // Example: only active products
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  }

  static async fetchProduct(id: string): Promise<Product> {
    try {
      const product = await ProductRepository.getProduct(id)
      // Business logic: validate product, transform data
      if (!product.isActive) {
        throw new Error('Product is not active')
      }
      return product
    } catch (error) {
      console.error('Error fetching product:', error)
      throw error
    }
  }

  static async createProduct(data: CreateProductDto): Promise<Product> {
    try {
      // Business logic: validate data, transform before sending
      const product = await ProductRepository.createProduct(data)
      return product
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  }

  static async updateProduct(id: string, data: UpdateProductDto): Promise<Product> {
    try {
      // Business logic: validate data
      const product = await ProductRepository.updateProduct(id, data)
      return product
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  }

  static async deleteProduct(id: string): Promise<void> {
    try {
      await ProductRepository.deleteProduct(id)
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  }
}