import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Product } from '../entities/product.entity';
import { StoreProduct } from '../entities/store-product.entity';
import { CreateProductDto, UpdateProductDto, GetProductsQueryDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(StoreProduct)
    private storeProductRepository: Repository<StoreProduct>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { storeId, storePrice, storeStock, ...productData } = createProductDto;

    const product = this.productRepository.create(productData);
    const savedProduct = await this.productRepository.save(product);

    // If storeId is provided, create the store-product association
    if (storeId) {
      if (!storePrice || storeStock === undefined) {
        throw new Error('storePrice and storeStock are required when storeId is provided');
      }

      const storeProduct = this.storeProductRepository.create({
        storeId,
        productId: savedProduct.id,
        price: storePrice,
        stock: storeStock,
      });
      await this.storeProductRepository.save(storeProduct);
    }

    return savedProduct;
  }

  async findAll(query: GetProductsQueryDto): Promise<{ data: Product[]; total: number; page: number; limit: number }> {
    const { q, category, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.productRepository.createQueryBuilder('product')
      .where('product.isActive = true');

    if (q) {
      queryBuilder.andWhere('product.name ILIKE :q', { q: `%${q}%` });
    }

    if (category) {
      queryBuilder.andWhere('product.category = :category', { category });
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('product.createdAt', 'DESC')
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['storeProducts'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    // Soft delete - set isActive to false
    product.isActive = false;
    await this.productRepository.save(product);
  }
}