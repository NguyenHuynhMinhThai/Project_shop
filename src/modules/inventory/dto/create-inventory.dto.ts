import { IsNumber, IsString, IsIn, Min } from 'class-validator';

export class CreateInventoryDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  purchasePrice: number;

  @IsString()
  @IsIn(['IN', 'OUT'])
  type: string;
} 