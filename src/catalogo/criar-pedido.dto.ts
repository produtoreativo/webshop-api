import { IsString, IsNotEmpty } from 'class-validator';

export class CriarPedidoDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  correlationId: string;
}
