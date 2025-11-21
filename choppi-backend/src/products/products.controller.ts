import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, GetProductsQueryDto } from './dto/product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new product',
    description: 'Creates a new global product that can be associated with stores. Requires authentication.'
  })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        name: { type: 'string', example: 'Leche Entera' },
        description: { type: 'string', example: 'Leche fresca pasteurizada' },
        basePrice: { type: 'number', format: 'decimal', example: 2.50 },
        category: { type: 'string', example: 'Lácteos' },
        imageUrl: { type: 'string', format: 'uri', example: 'https://example.com/images/leche-entera.jpg' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
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
    status: 400,
    description: 'Bad request - validation error',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'array', items: { type: 'string' }, example: ['name should not be empty'] },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all products',
    description: 'Retrieves a paginated list of all global products with optional search and filtering.'
  })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Search term for product name (case-insensitive)',
    example: 'leche'
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filter by product category',
    example: 'Lácteos'
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (1-based)',
    example: 1
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page',
    example: 10
  })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
              name: { type: 'string', example: 'Leche Entera' },
              description: { type: 'string', example: 'Leche fresca pasteurizada' },
              basePrice: { type: 'number', format: 'decimal', example: 2.50 },
              category: { type: 'string', example: 'Lácteos' },
              imageUrl: { type: 'string', format: 'uri', example: 'https://example.com/images/leche-entera.jpg' },
              isActive: { type: 'boolean', example: true },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          }
        },
        total: { type: 'number', example: 25 },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 }
      }
    }
  })
  findAll(@Query() query: GetProductsQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a product by ID',
    description: 'Retrieves a single global product by its UUID, including related store products.'
  })
  @ApiParam({
    name: 'id',
    description: 'Product UUID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Product found',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        name: { type: 'string', example: 'Leche Entera' },
        description: { type: 'string', example: 'Leche fresca pasteurizada' },
        basePrice: { type: 'number', format: 'decimal', example: 2.50 },
        category: { type: 'string', example: 'Lácteos' },
        imageUrl: { type: 'string', format: 'uri', example: 'https://example.com/images/leche-entera.jpg' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        storeProducts: {
          type: 'array',
          items: { type: 'object' },
          description: 'Related store products with pricing and stock info'
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Product with ID 123e4567-e89b-12d3-a456-426614174000 not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a product',
    description: 'Updates an existing global product. Requires authentication.'
  })
  @ApiParam({
    name: 'id',
    description: 'Product UUID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        name: { type: 'string', example: 'Leche Entera Premium' },
        description: { type: 'string', example: 'Leche fresca pasteurizada premium' },
        basePrice: { type: 'number', format: 'decimal', example: 3.00 },
        category: { type: 'string', example: 'Lácteos Premium' },
        imageUrl: { type: 'string', format: 'uri', example: 'https://example.com/images/leche-premium.jpg' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token required'
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found'
  })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a product',
    description: 'Soft deletes a global product (sets isActive to false). Requires authentication.'
  })
  @ApiParam({
    name: 'id',
    description: 'Product UUID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token required'
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found'
  })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}