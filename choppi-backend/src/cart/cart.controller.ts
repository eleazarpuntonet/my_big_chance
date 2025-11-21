import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CartQuoteDto, CartQuoteResponseDto } from './dto/cart.dto';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('quote')
  @ApiOperation({
    summary: 'Calculate cart total price',
    description: 'Calculates the total price for a shopping cart, validating stock availability and applying store-specific pricing. This endpoint validates that all requested products are available in the specified store and have sufficient stock.'
  })
  @ApiResponse({
    status: 200,
    description: 'Cart quote calculated successfully',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', format: 'decimal', example: 15.75, description: 'Total price for all items in cart' },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              storeProductId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174001' },
              productName: { type: 'string', example: 'Leche Entera' },
              quantity: { type: 'number', example: 2 },
              unitPrice: { type: 'number', format: 'decimal', example: 2.75 },
              subtotal: { type: 'number', format: 'decimal', example: 5.50 }
            }
          },
          description: 'Detailed breakdown of each cart item'
        },
        storeId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000', description: 'Store UUID for the cart' }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request - validation error or insufficient stock',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          oneOf: [
            { type: 'string', example: 'Insufficient stock for product Leche Entera. Requested: 5, Available: 3' },
            { type: 'array', items: { type: 'string' }, example: ['quantity must be a positive number'] }
          ]
        },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Store product not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Store product with ID 123e4567-e89b-12d3-a456-426614174001 not found in store 123e4567-e89b-12d3-a456-426614174000' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  async quote(@Body() cartQuoteDto: CartQuoteDto): Promise<CartQuoteResponseDto> {
    return this.cartService.calculateQuote(cartQuoteDto);
  }
}