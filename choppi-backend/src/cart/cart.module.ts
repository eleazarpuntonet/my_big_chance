import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreProduct } from '../entities/store-product.entity';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StoreProduct])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}