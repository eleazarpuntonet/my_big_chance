import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Store } from '../entities/store.entity';
import { CreateStoreDto, UpdateStoreDto, GetStoresQueryDto } from './dto/store.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) {}

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const store = this.storeRepository.create(createStoreDto);
    return this.storeRepository.save(store);
  }

  async findAll(query: GetStoresQueryDto): Promise<{ data: Store[]; total: number; page: number; limit: number }> {
    const { q, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.storeRepository.createQueryBuilder('store');

    if (q) {
      queryBuilder.where('store.name ILIKE :q', { q: `%${q}%` });
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('store.createdAt', 'DESC')
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { id },
      relations: ['storeProducts'],
    });

    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }

    return store;
  }

  async update(id: string, updateStoreDto: UpdateStoreDto): Promise<Store> {
    const store = await this.findOne(id);
    Object.assign(store, updateStoreDto);
    return this.storeRepository.save(store);
  }

  async remove(id: string): Promise<void> {
    const store = await this.findOne(id);
    // Soft delete - set isActive to false
    store.isActive = false;
    await this.storeRepository.save(store);
  }
}