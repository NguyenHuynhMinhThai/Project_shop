import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';

export interface ProductDisplay {
  name: string;
  price: number;
  discountedPrice: number;
  imageUrl: string;
}

export async function implementCreateProduct(
  createProductDto: CreateProductDto,
  productRepository: Repository<Product>,
): Promise<Product> {
  if (createProductDto.isSpecialTax && (createProductDto.specialTax === undefined || createProductDto.specialTax === null)) {
    createProductDto.specialTax = 8;
  }
  if (!createProductDto.isSpecialTax) {
    createProductDto.specialTax = 0;
  }
  if (createProductDto.discount === undefined || createProductDto.discount === null) {
    createProductDto.discount = 0;
  }
  const product = productRepository.create(createProductDto);
  return productRepository.save(product);
}

export async function implementFindAllProducts(
  productRepository: Repository<Product>,
): Promise<ProductDisplay[]> {
  const products = await productRepository.find();
  return products.map((p) => ({
    name: p.name,
    price: Number(p.price),
    discountedPrice: Number(p.price) * (1 - Number(p.discount) / 100),
    imageUrl: p.imageUrl,
  }));
}

export async function implementFindOneProduct(
  id: number,
  productRepository: Repository<Product>,
): Promise<ProductDisplay> {
  const p = await productRepository.findOne({ where: { id } });
  if (!p) {
    throw new NotFoundException(`Product with ID ${id} not found`);
  }
  return {
    name: p.name,
    price: Number(p.price),
    discountedPrice: Number(p.price) * (1 - Number(p.discount) / 100),
    imageUrl: p.imageUrl,
  };
}

export async function implementUpdateProduct(
  id: number,
  updateProductDto: Partial<Product>,
  productRepository: Repository<Product>,
): Promise<Product> {
  const product = await productRepository.findOne({ where: { id } });
  if (!product) {
    throw new NotFoundException(`Product with ID ${id} not found`);
  }
  Object.assign(product, updateProductDto);
  return productRepository.save(product);
}

export async function implementRemoveProduct(
  id: number,
  productRepository: Repository<Product>,
): Promise<void> {
  const product = await productRepository.findOne({ where: { id } });
  if (!product) {
    throw new NotFoundException(`Product with ID ${id} not found`);
  }
  await productRepository.remove(product);
} 