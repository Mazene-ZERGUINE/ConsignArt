import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import {
  type ActivityStatus,
  ActivityStatusEnum,
} from '../../../shared/enums/activity-status.enum';

export class ChangeArtistStatusDto {
  @ApiProperty({ description: 'New activity status of the artist', enum: ActivityStatusEnum })
  @IsEnum(ActivityStatusEnum)
  @IsNotEmpty()
  status: ActivityStatus;
}
