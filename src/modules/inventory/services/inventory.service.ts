import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory, InventoryType } from '../entities/inventory.entity';
import { CreateInventoryDto } from '../dto/create-inventory.dto';
import { ProductService } from '../../products/services/product.service';
import {
  implementCreateInventory,
  implementFindAllInventory,
  implementGetStockValue,
} from '../implement/inventory.implement';
import { UpdateInventoryDto } from '../dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    private productService: ProductService,
  ) {}

  async create(createInventoryDto: CreateInventoryDto): Promise<Inventory> {
    return implementCreateInventory(
      createInventoryDto,
      this.inventoryRepository,
      this.productService,
    );
  }

  async findAll(): Promise<Inventory[]> {
    return implementFindAllInventory(this.inventoryRepository);
  }

  async getStockValue(): Promise<number> {
    return implementGetStockValue(this.inventoryRepository);
  }

  async update(id: number, updateInventoryDto: UpdateInventoryDto): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findOne({ where: { id } });
    if (!inventory) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }
    Object.assign(inventory, updateInventoryDto);
    return this.inventoryRepository.save(inventory);
  }

  async remove(id: number): Promise<void> {
    const inventory = await this.inventoryRepository.findOne({ where: { id } });
    if (!inventory) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }
    await this.inventoryRepository.remove(inventory);
  }
}
