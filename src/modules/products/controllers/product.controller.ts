import { Controller, Get, Post, Body, Param, HttpCode, Put, Delete, Query } from '@nestjs/common';
import { ProductService, ProductDisplay, ProductPaginationResult } from '../services/product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { Product } from '../entities/product.entity';
import { UpdateProductDto } from '../dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<ProductPaginationResult> {
    return this.productService.findAll(Number(page) || 1, Number(limit) || 5);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ProductDisplay> {
    return this.productService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
} 