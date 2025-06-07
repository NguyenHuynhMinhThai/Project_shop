import { Controller, Get, Post, Body, HttpCode } from '@nestjs/common';
import { InventoryService } from '../services/inventory.service';
import { CreateInventoryDto } from '../dto/create-inventory.dto';
import { Inventory } from '../entities/inventory.entity';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createInventoryDto: CreateInventoryDto): Promise<Inventory> {
    return this.inventoryService.create(createInventoryDto);
  }

  @Get()
  findAll(): Promise<Inventory[]> {
    return this.inventoryService.findAll();
  }

  @Get('stock-value')
  getStockValue(): Promise<number> {
    return this.inventoryService.getStockValue();
  }
} 