import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Inventory, InventoryType } from '../entities/inventory.entity';
import { CreateInventoryDto } from '../dto/create-inventory.dto';
import { ProductService } from '../../products/services/product.service';
import { Product } from '../../products/entities/product.entity';

export async function implementCreateInventory(
  createInventoryDto: CreateInventoryDto,
  inventoryRepository: Repository<Inventory>,
  productService: ProductService,
): Promise<Inventory> {
  const product = await productService['productRepository'].findOne({ where: { id: createInventoryDto.productId } });
  if (!product) {
    throw new BadRequestException(`Product with ID ${createInventoryDto.productId} not found`);
  }

  const inventory = inventoryRepository.create({
    product,
    quantity: createInventoryDto.quantity,
    purchasePrice: createInventoryDto.purchasePrice,
    totalValue: createInventoryDto.quantity * createInventoryDto.purchasePrice,
    type: createInventoryDto.type,
  });

  const savedInventory = await inventoryRepository.save(inventory);

  if (createInventoryDto.type === InventoryType.IN) {
    product.quantity += createInventoryDto.quantity;
    await productService['productRepository'].save(product);
  } else if (createInventoryDto.type === InventoryType.OUT) {
    if (product.quantity < createInventoryDto.quantity) {
      throw new BadRequestException('Insufficient stock for this operation');
    }
    product.quantity -= createInventoryDto.quantity;
    await productService['productRepository'].save(product);
  }

  return savedInventory;
}

export async function implementFindAllInventory(
  inventoryRepository: Repository<Inventory>,
): Promise<Inventory[]> {
  return inventoryRepository.find({
    relations: ['product'],
  });
}

export async function implementGetStockValue(
  inventoryRepository: Repository<Inventory>,
): Promise<number> {
  const inventories = await implementFindAllInventory(inventoryRepository);
  return inventories.reduce(
    (total, inventory) => total + inventory.totalValue,
    0,
  );
}
