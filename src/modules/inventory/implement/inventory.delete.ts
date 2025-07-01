import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Inventory } from '../entities/inventory.entity';

export async function implementRemoveInventory(
  id: number,
  inventoryRepository: Repository<Inventory>,
): Promise<void> {
  const inventory = await inventoryRepository.findOne({ where: { id } });
  if (!inventory) {
    throw new NotFoundException(`Inventory with ID ${id} not found`);
  }
  await inventoryRepository.remove(inventory);
} 