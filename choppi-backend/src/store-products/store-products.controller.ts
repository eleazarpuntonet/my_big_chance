import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { StoreProductsService } from './store-products.service';
import { CreateStoreProductDto, UpdateStoreProductDto, GetStoreProductsQueryDto } from './dto/store-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('store-products')
@Controller('stores/:storeId/products')
export class StoreProductsController {
  constructor(private readonly storeProductsService: StoreProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add a product to a store',
    description: 'Associates an existing global product with a store, setting store-specific price and stock. Requires authentication.'
  })
  @ApiParam({
    name: 'storeId',
    description: 'Store UUID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 201,
    description: 'Product added to store successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174001' },
        storeId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        productId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174002' },
        price: { type: 'number', format: 'decimal', example: 2.75 },
        stock: { type: 'number', example: 50 },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        product: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            category: { type: 'string' },
            imageUrl: { type: 'string', format: 'uri' }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token required',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Store or product not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Store with ID 123e4567-e89b-12d3-a456-426614174000 not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error or product already exists in store',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Product already exists in this store' },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  create(
    @Param('storeId') storeId: string,
    @Body() createStoreProductDto: CreateStoreProductDto,
  ) {
    return this.storeProductsService.create(storeId, createStoreProductDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get products for a store with pagination and filters',
    description: 'Retrieves paginated list of products available in a specific store with optional search and stock filters.'
  })
  @ApiParam({
    name: 'storeId',
    description: 'Store UUID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Search query for product name (case-insensitive partial match)',
    example: 'leche'
  })
  @ApiQuery({
    name: 'inStock',
    required: false,
    description: 'Filter by products with stock > 0 only',
    example: true,
    type: 'boolean'
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (1-based)',
    example: 1,
    type: 'number'
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page (max 100)',
    example: 20,
    type: 'number'
  })
  @ApiResponse({
    status: 200,
    description: 'List of store products with pagination metadata',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              storeId: { type: 'string' },
              productId: { type: 'string' },
              price: { type: 'number', format: 'decimal' },
              stock: { type: 'number' },
              isActive: { type: 'boolean' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
              product: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  description: { type: 'string' },
                  category: { type: 'string' },
                  imageUrl: { type: 'string', format: 'uri' }
                }
              }
            }
          }
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 45 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 20 },
            totalPages: { type: 'number', example: 3 }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Store not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Store with ID 123e4567-e89b-12d3-a456-426614174000 not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  findAll(
    @Param('storeId') storeId: string,
    @Query() query: GetStoreProductsQueryDto,
  ) {
    return this.storeProductsService.findAllByStore(storeId, query);
  }

  @Get(':storeProductId')
  @ApiOperation({
    summary: 'Get a specific store product',
    description: 'Retrieves detailed information about a specific product in a store, including full product details.'
  })
  @ApiParam({
    name: 'storeId',
    description: 'Store UUID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiParam({
    name: 'storeProductId',
    description: 'Store Product UUID',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @ApiResponse({
    status: 200,
    description: 'Store product found',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        storeId: { type: 'string' },
        productId: { type: 'string' },
        price: { type: 'number', format: 'decimal' },
        stock: { type: 'number' },
        isActive: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        product: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            basePrice: { type: 'number', format: 'decimal' },
            category: { type: 'string' },
            imageUrl: { type: 'string', format: 'uri' },
            isActive: { type: 'boolean' }
          }
        },
        store: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            address: { type: 'string' },
            phone: { type: 'string' }
          }
        }
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
        message: { type: 'string', example: 'Store product with ID 123e4567-e89b-12d3-a456-426614174001 not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  findOne(
    @Param('storeId') storeId: string,
    @Param('storeProductId') storeProductId: string,
  ) {
    return this.storeProductsService.findOne(storeId, storeProductId);
  }

  @Patch(':storeProductId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a store product',
    description: 'Updates price, stock, or active status of a product in a store. Requires authentication.'
  })
  @ApiParam({
    name: 'storeId',
    description: 'Store UUID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiParam({
    name: 'storeProductId',
    description: 'Store Product UUID',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @ApiResponse({
    status: 200,
    description: 'Store product updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        storeId: { type: 'string' },
        productId: { type: 'string' },
        price: { type: 'number', format: 'decimal' },
        stock: { type: 'number' },
        isActive: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        product: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            category: { type: 'string' }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token required',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' }
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
        message: { type: 'string', example: 'Store product with ID 123e4567-e89b-12d3-a456-426614174001 not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'array', items: { type: 'string' }, example: ['price must be a positive number'] },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  update(
    @Param('storeId') storeId: string,
    @Param('storeProductId') storeProductId: string,
    @Body() updateStoreProductDto: UpdateStoreProductDto,
  ) {
    return this.storeProductsService.update(storeId, storeProductId, updateStoreProductDto);
  }

  @Delete(':storeProductId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Remove a product from a store (soft delete)',
    description: 'Soft deletes a product from a store by setting isActive to false. Requires authentication.'
  })
  @ApiParam({
    name: 'storeId',
    description: 'Store UUID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiParam({
    name: 'storeProductId',
    description: 'Store Product UUID',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @ApiResponse({
    status: 200,
    description: 'Store product removed successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Store product removed successfully' },
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174001' }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token required',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' }
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
        message: { type: 'string', example: 'Store product with ID 123e4567-e89b-12d3-a456-426614174001 not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  remove(
    @Param('storeId') storeId: string,
    @Param('storeProductId') storeProductId: string,
  ) {
    return this.storeProductsService.remove(storeId, storeProductId);
  }
}