import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { UserRoles, type UserRole } from '../../../../shared/enums/user-roles.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Users registration email address (must be valide email and unique)',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Users registration password (must be at least 12 characters long)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(12, { message: 'Password must be at least 12 characters long' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number or special character',
  })
  password: string;

  @ApiProperty({
    description:
      'Users registration role (must be one of the following: collector, gallery, artist, admin)',
    enum: UserRoles,
  })
  @IsEnum(UserRoles)
  @IsNotEmpty()
  userRole: UserRole;
}
