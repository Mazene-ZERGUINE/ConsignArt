import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({
    description: 'Email address of the admin account to create (must be a valid and unique email)',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
