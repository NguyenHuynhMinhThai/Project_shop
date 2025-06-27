import { DataSource } from 'typeorm';
import { Inventory } from './modules/inventory/entities/inventory.entity';
import { Product } from './modules/products/entities/product.entity';

export const AppDataSource = new DataSource({
  type: 'mysql', // hoặc 'mysql', 'sqlite', ...
  host: 'localhost',
  port: 3306, // MySQL default port
  username: 'root',
  password: 'Admin@2025',
  database: 'shop_db',
  entities: [Inventory, Product],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
}); 