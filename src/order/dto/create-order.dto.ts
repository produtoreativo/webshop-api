import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsPositive,
  ValidateNested,
} from 'class-validator';

class OrderItemDto {
  @ApiProperty()
  @IsNotEmpty()
  sku: string;
  @ApiProperty()
  @IsPositive()
  qty: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
