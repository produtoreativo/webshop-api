import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'jack@doe.com' })
  @IsNotEmpty()
  @IsEmail()
  username: string;
  @ApiProperty({ example: 'Password1' })
  @IsNotEmpty()
  password: string;
}
