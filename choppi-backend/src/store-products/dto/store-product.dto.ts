import { IsNotEmpty, IsUUID, IsOptional, IsNumber, IsString, IsBoolean, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateStoreProductDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stock: number;
}

export class UpdateStoreProductDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class GetStoreProductsQueryDto {
  @ApiPropertyOptional({
    description: 'Search query for product name',
    example: 'product'
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({
    description: 'Filter by in-stock products only',
    example: true
  })
  @IsOptional()
  @Type(() => Boolean)
  inStock?: boolean;

  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    example: 1
  })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10
  })
  @IsOptional()
  limit?: number = 10;
}