import { IsNotEmpty, IsUUID, IsNumber, Min, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CartItemDto {
  @ApiProperty({
    description: 'Store product ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  @IsNotEmpty()
  storeProductId: string;

  @ApiProperty({
    description: 'Quantity of the product',
    example: 2,
    minimum: 1
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CartQuoteDto {
  @ApiProperty({
    description: 'List of cart items',
    type: [CartItemDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}

export class CartQuoteResponseDto {
  @ApiProperty({
    description: 'Total price for all items in cart',
    example: 25.50
  })
  total: number;

  @ApiProperty({
    description: 'Breakdown by item',
    example: [
      {
        storeProductId: '123e4567-e89b-12d3-a456-426614174000',
        productName: 'Leche Entera',
        unitPrice: 2.50,
        quantity: 2,
        subtotal: 5.00
      }
    ]
  })
  items: {
    storeProductId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
  }[];
}