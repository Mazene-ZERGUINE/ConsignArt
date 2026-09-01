import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  type ExpositionType,
  ExpositionTypeEnum,
} from '../../../shared/enums/exposition-type.enum';
import { IsAfterOrEqualDate } from '../../../core/validators/property-comparison.validators';

export class CreateExpositionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  @IsAfterOrEqualDate('startDate', { message: 'endDate must be on or after startDate' })
  endDate: string;

  @IsEnum(ExpositionTypeEnum)
  expositionType: ExpositionType;

  @ApiPropertyOptional({ description: 'Required for on_site expositions' })
  @ValidateIf((o: CreateExpositionDto) => o.expositionType === ExpositionTypeEnum.ON_SITE)
  @IsString()
  @IsNotEmpty({ message: 'address is required for on-site expositions' })
  @MaxLength(255)
  address?: string;

  @ApiPropertyOptional({ maxLength: 5 })
  @ValidateIf((o: CreateExpositionDto) => o.expositionType === ExpositionTypeEnum.ON_SITE)
  @IsString()
  @IsNotEmpty({ message: 'zipCode is required for on-site expositions' })
  @MaxLength(5)
  zipCode?: string;

  @ApiPropertyOptional()
  @ValidateIf((o: CreateExpositionDto) => o.expositionType === ExpositionTypeEnum.ON_SITE)
  @IsString()
  @IsNotEmpty({ message: 'city is required for on-site expositions' })
  @MaxLength(255)
  city?: string;

  @ApiPropertyOptional({ description: 'Required for virtual expositions' })
  @ValidateIf((o: CreateExpositionDto) => o.expositionType === ExpositionTypeEnum.VIRTUAL)
  @IsUrl()
  @IsNotEmpty({ message: 'virtualLink is required for virtual expositions' })
  virtualLink?: string;

  @ApiPropertyOptional({ description: 'Art works featured in the exposition, cannot be empty' })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  artWorkIds: string[];
}
