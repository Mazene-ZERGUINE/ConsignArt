import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ description: 'The current password of the authenticated user' })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({
    description: 'The new password (must be at least 12 characters long)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(12, { message: 'Password must be at least 12 characters long' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number or special character',
  })
  newPassword: string;
}
