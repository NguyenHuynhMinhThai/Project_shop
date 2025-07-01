import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Inventory } from '../entities/inventory.entity';
import { UpdateInventoryDto } from '../dto/update-inventory.dto';

export async function implementUpdateInventory(
  id: number,
  updateInventoryDto: UpdateInventoryDto,
  inventoryRepository: Repository<Inventory>,
): Promise<Inventory> {
  const inventory = await inventoryRepository.findOne({ where: { id } });
  if (!inventory) {
    throw new NotFoundException(`Inventory with ID ${id} not found`);
  }
  Object.assign(inventory, updateInventoryDto);
  return inventoryRepository.save(inventory);
} 