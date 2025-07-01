import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import {
  implementCreateProduct,
  implementFindAllProducts,
  implementFindOneProduct,
  implementUpdateProduct,
  implementRemoveProduct,
  implementFindAllProductsPaginated,
  ProductDisplay,
  ProductPaginationResult,
} from '../implement/product.implement';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return implementCreateProduct(createProductDto, this.productRepository);
  }

  async findAll(page = 1, limit = 5): Promise<ProductPaginationResult> {
    return implementFindAllProductsPaginated(this.productRepository, page, limit);
  }

  async findOne(id: number): Promise<ProductDisplay> {
    return implementFindOneProduct(id, this.productRepository);
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    return implementUpdateProduct(id, updateProductDto, this.productRepository);
  }

  async remove(id: number): Promise<void> {
    return implementRemoveProduct(id, this.productRepository);
  }
}

export { ProductDisplay, ProductPaginationResult } from '../implement/product.implement'; 