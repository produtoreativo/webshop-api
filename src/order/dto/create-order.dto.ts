import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsPositive,
  ValidateNested,
} from 'class-validator';

class OrderItemDto {
  @IsNotEmpty()
  sku: string;
  @IsPositive()
  quantity: number;
}

export class CreateOrderDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
