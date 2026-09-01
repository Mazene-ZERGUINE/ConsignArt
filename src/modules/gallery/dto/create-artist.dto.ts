import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from '../../../shared/dto/create-user.dto';

export class CreateArtistDto {
  @ApiProperty({ type: () => CreateUserDto })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateUserDto)
  createUserDto: CreateUserDto;

  @ApiProperty({ description: 'Artist first name (example: John)', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  firstName: string;

  @ApiProperty({ description: 'Artist last name (example: Doe)', maxLength: 255 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  lastName: string;

  @ApiProperty({ description: 'Short biography of the artist', maxLength: 2000 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(2000)
  bio: string;

  @ApiProperty({ description: 'Link to the artist portfolio', example: 'https://…' })
  @IsNotEmpty()
  @IsUrl()
  portfolioUrl: string;

  @ApiProperty({ description: 'Artist nationality', maxLength: 60 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  nationality: string;
}
