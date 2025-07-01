import { Repository } from 'typeorm';
import { Inventory } from '../entities/inventory.entity';

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
  return inventories.reduce((total, inventory) => total + inventory.totalValue, 0);
} 