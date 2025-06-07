import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from '../entities/inventory.entity';
import { CreateInventoryDto } from '../dto/create-inventory.dto';
import { ProductService } from '../../products/services/product.service';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    private productService: ProductService,
  ) {}

  async create(createInventoryDto: CreateInventoryDto): Promise<Inventory> {
    const product = await this.productService.findOne(createInventoryDto.productId);
    
    const inventory = this.inventoryRepository.create({
      product,
      quantity: createInventoryDto.quantity,
      purchasePrice: createInventoryDto.purchasePrice,
      totalValue: createInventoryDto.quantity * createInventoryDto.purchasePrice,
      type: createInventoryDto.type,
    });

    const savedInventory = await this.inventoryRepository.save(inventory);
    
    if (createInventoryDto.type === 'IN') {
      await this.productService.updateStock(product.id, createInventoryDto.quantity);
    } else if (createInventoryDto.type === 'OUT') {
      if (product.quantity < createInventoryDto.quantity) {
        throw new BadRequestException('Insufficient stock for this operation');
      }
      await this.productService.updateStock(product.id, -createInventoryDto.quantity);
    }

    return savedInventory;
  }

  async findAll(): Promise<Inventory[]> {
    return this.inventoryRepository.find({
      relations: ['product'],
    });
  }

  async getStockValue(): Promise<number> {
    const inventories = await this.findAll();
    return inventories.reduce((total, inventory) => total + inventory.totalValue, 0);
  }
} 