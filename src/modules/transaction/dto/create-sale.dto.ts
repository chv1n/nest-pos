import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ItemInput } from '../interfaces/item-input.interface';

class ItemDto implements ItemInput {
  @IsString()
  product_id: string;

  @IsNumber()
  quantity: number;
}

export class CreateSaleDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: ItemDto[];
}
