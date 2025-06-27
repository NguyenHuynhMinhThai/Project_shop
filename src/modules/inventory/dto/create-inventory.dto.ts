import { IsNumber, IsNotEmpty, IsEnum } from 'class-validator';
import { InventoryType } from '../entities/inventory.entity';

export class CreateInventoryDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  purchasePrice: number;

  @IsEnum(InventoryType)
  type: InventoryType;
}
