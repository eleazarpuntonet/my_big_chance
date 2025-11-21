import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from '../entities/store.entity';
import { Product } from '../entities/product.entity';
import { StoreProduct } from '../entities/store-product.entity';
import { SeedsService } from './seeds.service';

@Module({
  imports: [TypeOrmModule.forFeature([Store, Product, StoreProduct])],
  providers: [SeedsService],
  exports: [SeedsService],
})
export class SeedsModule {}