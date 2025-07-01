import { Repository } from 'typeorm';
import { Inventory } from '../../entities/inventory.entity';
import { implementFindAllInventory } from './find-inventory.implement';

export async function implementGetStockValue(
  inventoryRepository: Repository<Inventory>,
): Promise<number> {
  const inventories = await implementFindAllInventory(inventoryRepository);
  return inventories.reduce((total, inventory) => total + inventory.totalValue, 0);
} 