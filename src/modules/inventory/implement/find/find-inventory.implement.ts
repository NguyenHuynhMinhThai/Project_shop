import { Repository } from 'typeorm';
import { Inventory } from '../../entities/inventory.entity';

export async function implementFindAllInventory(
  inventoryRepository: Repository<Inventory>,
): Promise<Inventory[]> {
  return inventoryRepository.find({
    relations: ['product'],
  });
} 