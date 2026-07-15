import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { UserRoles, type UserRole } from '../enums/user-roles.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

  @ApiPropertyOptional({
    description: "Gallery display name (required when userRole is 'gallery', ignored otherwise)",
  })
  @ValidateIf((dto: CreateUserDto) => dto.userRole === UserRoles.GALLERY)
  @IsString()
  @IsNotEmpty()
  galleryName?: string;
}
