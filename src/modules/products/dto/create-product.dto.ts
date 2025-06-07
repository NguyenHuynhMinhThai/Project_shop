import { IsString, IsNumber, IsUrl, Min, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsUrl()
  imageUrl: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsOptional()
  @IsBoolean()
  isSpecialTax?: boolean;

  @IsOptional()
  @IsNumber()
  specialTax?: number;
} 