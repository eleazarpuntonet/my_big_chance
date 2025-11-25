// Product types synchronized with backend

export interface Product {
  id: string;
  name: string;
  description?: string;
  basePrice?: number;
  category?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  basePrice?: number;
  category?: string;
  imageUrl?: string;
  storeId?: string;
  storePrice?: number;
  storeStock?: number;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  basePrice?: number;
  category?: string;
  imageUrl?: string;
  isActive?: boolean;
}

export interface GetProductsQueryDto {
  q?: string;
  page?: number;
  limit?: number;
}

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}