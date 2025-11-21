import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreProduct } from '../entities/store-product.entity';
import { Store } from '../entities/store.entity';
import { Product } from '../entities/product.entity';
import { CreateStoreProductDto, UpdateStoreProductDto, GetStoreProductsQueryDto } from './dto/store-product.dto';

@Injectable()
export class StoreProductsService {
  constructor(
    @InjectRepository(StoreProduct)
    private storeProductRepository: Repository<StoreProduct>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(storeId: string, createStoreProductDto: CreateStoreProductDto): Promise<StoreProduct> {
    const { productId } = createStoreProductDto;

    // Verify store exists
    const store = await this.storeRepository.findOne({ where: { id: storeId } });
    if (!store) {
      throw new NotFoundException(`Store with ID ${storeId} not found`);
    }

    // Verify product exists
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Check if product already exists in this store
    const existingStoreProduct = await this.storeProductRepository.findOne({
      where: { storeId, productId },
    });

    if (existingStoreProduct) {
      throw new BadRequestException('Product already exists in this store');
    }

    const storeProduct = this.storeProductRepository.create({
      ...createStoreProductDto,
      storeId,
    });

    return this.storeProductRepository.save(storeProduct);
  }

  async findAllByStore(
    storeId: string,
    query: GetStoreProductsQueryDto,
  ): Promise<{ data: StoreProduct[]; total: number; page: number; limit: number }> {
    const { q, inStock, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    // Verify store exists
    const store = await this.storeRepository.findOne({ where: { id: storeId } });
    if (!store) {
      throw new NotFoundException(`Store with ID ${storeId} not found`);
    }

    const queryBuilder = this.storeProductRepository
      .createQueryBuilder('storeProduct')
      .leftJoinAndSelect('storeProduct.product', 'product')
      .where('storeProduct.storeId = :storeId', { storeId })
      .andWhere('storeProduct.isActive = true');

    if (q) {
      queryBuilder.andWhere('product.name ILIKE :q', { q: `%${q}%` });
    }

    if (inStock) {
      queryBuilder.andWhere('storeProduct.stock > 0');
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('product.name', 'ASC')
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async findOne(storeId: string, storeProductId: string): Promise<StoreProduct> {
    const storeProduct = await this.storeProductRepository.findOne({
      where: { id: storeProductId, storeId },
      relations: ['product', 'store'],
    });

    if (!storeProduct) {
      throw new NotFoundException(`Store product with ID ${storeProductId} not found in store ${storeId}`);
    }

    return storeProduct;
  }

  async update(storeId: string, storeProductId: string, updateStoreProductDto: UpdateStoreProductDto): Promise<StoreProduct> {
    const storeProduct = await this.findOne(storeId, storeProductId);
    Object.assign(storeProduct, updateStoreProductDto);
    return this.storeProductRepository.save(storeProduct);
  }

  async remove(storeId: string, storeProductId: string): Promise<void> {
    const storeProduct = await this.findOne(storeId, storeProductId);
    // Soft delete - set isActive to false
    storeProduct.isActive = false;
    await this.storeProductRepository.save(storeProduct);
  }
}