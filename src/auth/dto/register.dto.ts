import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

class AddressRegionDto {
  regionCode: string;
  region: string;
  regionId: number;
}
class AddressDto {
  firstname: string;
  lastname: string;
  defaultShipping: boolean;
  defaultBilling: boolean;
  region: AddressRegionDto;
  postcode: string;
  street: Array<string>;
  city: string;
  telephone: string;
  countryId: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'jack@doe.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty({ example: 'Password1' })
  @IsNotEmpty()
  password: string;
  @ApiProperty({ example: 'Jack' })
  @IsNotEmpty()
  firstname: string;
  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  lastname: string;
  // @ApiProperty()
  @IsOptional()
  address: AddressDto;
}
