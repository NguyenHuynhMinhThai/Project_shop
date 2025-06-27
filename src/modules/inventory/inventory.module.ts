import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryController } from './controllers/inventory.controller';
import { InventoryService } from './services/inventory.service';
import { Inventory } from './entities/inventory.entity';
import { ProductModule } from '../products/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory]), ProductModule],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}
