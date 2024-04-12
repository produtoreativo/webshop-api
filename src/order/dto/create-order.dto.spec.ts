import 'reflect-metadata';

import { plainToInstance } from 'class-transformer';
import { CreateOrderDto } from './create-order.dto';
import { validate } from 'class-validator';

describe('CreateOrderDto', () => {
  it('should be defined', async () => {
    const dto = { items: [] };
    const ofImportDto = plainToInstance(CreateOrderDto, dto);
    const [error] = await validate(ofImportDto);
    expect(error.property).toBe('items');
  });
});
