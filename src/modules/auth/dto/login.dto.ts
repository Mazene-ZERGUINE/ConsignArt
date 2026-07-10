import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { type UserRole, UserRoles } from '../../../shared/enums/user-roles.enum';

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

  @ApiProperty({
    description: 'Users role must be one of the following: collector, gallery, artist, admin',
  })
  @IsEnum(UserRoles)
  @IsNotEmpty()
  userRole: UserRole;
}
