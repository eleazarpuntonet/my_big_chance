import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreProduct } from '../entities/store-product.entity';
import { CartQuoteDto, CartQuoteResponseDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(StoreProduct)
    private storeProductRepository: Repository<StoreProduct>,
  ) {}

  async calculateQuote(cartQuoteDto: CartQuoteDto): Promise<CartQuoteResponseDto> {
    const { items } = cartQuoteDto;
    let total = 0;
    const responseItems: CartQuoteResponseDto['items'] = [];

    for (const item of items) {
      const { storeProductId, quantity } = item;

      // Find the store product with relations
      const storeProduct = await this.storeProductRepository.findOne({
        where: { id: storeProductId, isActive: true },
        relations: ['product'],
      });

      if (!storeProduct) {
        throw new NotFoundException(`Store product with ID ${storeProductId} not found`);
      }

      if (!storeProduct.product) {
        throw new NotFoundException(`Product for store product ${storeProductId} not found`);
      }

      // Check stock availability
      if (storeProduct.stock < quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${storeProduct.product.name}. Available: ${storeProduct.stock}, Requested: ${quantity}`
        );
      }

      const unitPrice = storeProduct.price;
      const subtotal = unitPrice * quantity;
      total += subtotal;

      responseItems.push({
        storeProductId,
        productName: storeProduct.product.name,
        unitPrice,
        quantity,
        subtotal: Math.round(subtotal * 100) / 100, // Round to 2 decimal places
      });
    }

    return {
      total: Math.round(total * 100) / 100, // Round to 2 decimal places
      items: responseItems,
    };
  }
}