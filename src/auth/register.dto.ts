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
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsNotEmpty()
  password: string;
  @ApiProperty()
  @IsNotEmpty()
  firstname: string;
  @ApiProperty()
  @IsNotEmpty()
  lastname: string;
  @ApiProperty()
  @IsOptional()
  address: AddressDto;
}
