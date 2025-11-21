import ApiService from '@/services/ApiService'
import { Product, CreateProductDto, UpdateProductDto, GetProductsQueryDto, ProductsResponse } from '../types/product.types'

export class ProductRepository {
  static async getProducts(query: GetProductsQueryDto = {}): Promise<ProductsResponse> {
    return ApiService.fetchDataWithAxios<ProductsResponse>({
      url: '/products',
      method: 'get',
      params: query,
    })
  }

  static async getProduct(id: string): Promise<Product> {
    return ApiService.fetchDataWithAxios<Product>({
      url: `/products/${id}`,
      method: 'get',
    })
  }

  static async createProduct(data: CreateProductDto): Promise<Product> {
    return ApiService.fetchDataWithAxios<Product>({
      url: '/products',
      method: 'post',
      data,
    })
  }

  static async updateProduct(id: string, data: UpdateProductDto): Promise<Product> {
    return ApiService.fetchDataWithAxios<Product>({
      url: `/products/${id}`,
      method: 'patch',
      data,
    })
  }

  static async deleteProduct(id: string): Promise<void> {
    return ApiService.fetchDataWithAxios<void>({
      url: `/products/${id}`,
      method: 'delete',
    })
  }
}