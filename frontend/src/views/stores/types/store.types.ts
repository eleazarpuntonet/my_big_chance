// Store types synchronized with backend

export interface Store {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  storeProducts?: StoreProduct[];
}

export interface StoreProduct {
  id: string;
  storeId: string;
  productId: string;
  price: number;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  product: {
    id: string;
    name: string;
    description?: string;
    basePrice?: number;
    category?: string;
    imageUrl?: string;
    isActive: boolean;
  };
}

export interface CreateStoreDto {
  name: string;
  description?: string;
  address?: string;
  phone?: string;
}

export interface UpdateStoreDto {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  isActive?: boolean;
}

export interface GetStoresQueryDto {
  q?: string;
  page?: number;
  limit?: number;
}

export interface GetStoreProductsQueryDto {
  q?: string;
  inStock?: boolean;
  page?: number;
  limit?: number;
}

export interface StoresResponse {
  data: Store[];
  total: number;
  page: number;
  limit: number;
}

export interface StoreProductsResponse {
  data: StoreProduct[];
  total: number;
  page: number;
  limit: number;
}