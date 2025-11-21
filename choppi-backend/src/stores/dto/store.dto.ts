import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateStoreDto {
  @ApiProperty({
    description: 'Store name',
    example: 'Supermercado Central',
    minLength: 1
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Store description',
    example: 'A large supermarket with fresh products'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Store address',
    example: 'Av. Principal 123, Ciudad Central'
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Store phone number',
    example: '+1234567890'
  })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class UpdateStoreDto {
  @ApiPropertyOptional({
    description: 'Store name',
    example: 'Supermercado Central'
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Store description',
    example: 'A large supermarket with fresh products'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Store address',
    example: 'Av. Principal 123, Ciudad Central'
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Store phone number',
    example: '+1234567890'
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Whether the store is active',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class GetStoresQueryDto {
  @ApiPropertyOptional({
    description: 'Search query for store name (case-insensitive partial match)',
    example: 'central'
  })
  @IsOptional()
  @IsString()
  q?: string;

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
    description: 'Number of items per page (max 100)',
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