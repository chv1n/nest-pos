import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ItemDto {
  @IsString()
  product_id: string;

  @IsNumber()
  quantity: number;
}

export class CreateSaleDto {
  @IsArray()
  @ValidateNested({ each: true }) // ตรวจทุก element ใน array
  @Type(() => ItemDto)
  items: ItemDto[];

  @IsNumber()
  @IsOptional()
  paid_amount: number;
}
