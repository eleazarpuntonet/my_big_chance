import { IsNotEmpty, IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Leche Entera',
    minLength: 1
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'Leche fresca pasteurizada'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Base price of the product',
    example: 2.50,
    minimum: 0,
    type: 'number',
    format: 'decimal'
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  basePrice?: number;

  @ApiPropertyOptional({
    description: 'Product category',
    example: 'Lácteos'
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Product image URL',
    example: 'https://example.com/images/leche-entera.jpg',
    format: 'uri'
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Product name',
    example: 'Leche Entera Premium'
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'Leche fresca pasteurizada premium'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Base price of the product',
    example: 3.00,
    minimum: 0,
    type: 'number',
    format: 'decimal'
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  basePrice?: number;

  @ApiPropertyOptional({
    description: 'Product category',
    example: 'Lácteos Premium'
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Product image URL',
    example: 'https://example.com/images/leche-premium.jpg',
    format: 'uri'
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class GetProductsQueryDto {
  @ApiPropertyOptional({
    description: 'Search term for product name (ILIKE)',
    example: 'leche'
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({
    description: 'Category filter',
    example: 'Lácteos'
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    example: 1,
    minimum: 1,
    default: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}