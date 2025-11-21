import ApiService from '@/services/ApiService'
import { Store, StoreProduct, CreateStoreDto, UpdateStoreDto, GetStoresQueryDto, GetStoreProductsQueryDto, StoresResponse, StoreProductsResponse } from '../types/store.types'

export class StoreRepository {
  static async getStores(query: GetStoresQueryDto = {}): Promise<StoresResponse> {
    return ApiService.fetchDataWithAxios<StoresResponse>({
      url: '/stores',
      method: 'get',
      params: query,
    })
  }

  static async getStore(id: string): Promise<Store> {
    return ApiService.fetchDataWithAxios<Store>({
      url: `/stores/${id}`,
      method: 'get',
    })
  }

  static async getStoreProducts(storeId: string, query: GetStoreProductsQueryDto = {}): Promise<StoreProductsResponse> {
    return ApiService.fetchDataWithAxios<StoreProductsResponse>({
      url: `/stores/${storeId}/products`,
      method: 'get',
      params: query,
    })
  }

  static async createStore(data: CreateStoreDto): Promise<Store> {
    return ApiService.fetchDataWithAxios<Store>({
      url: '/stores',
      method: 'post',
      data,
    })
  }

  static async updateStore(id: string, data: UpdateStoreDto): Promise<Store> {
    return ApiService.fetchDataWithAxios<Store>({
      url: `/stores/${id}`,
      method: 'patch',
      data,
    })
  }

  static async deleteStore(id: string): Promise<void> {
    return ApiService.fetchDataWithAxios<void>({
      url: `/stores/${id}`,
      method: 'delete',
    })
  }
}