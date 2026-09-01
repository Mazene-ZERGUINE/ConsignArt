import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Users login email address (must be valide email)',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Users login password (must be at least 12 characters long)',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
