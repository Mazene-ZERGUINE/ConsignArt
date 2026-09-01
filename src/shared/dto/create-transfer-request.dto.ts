import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateTransferRequestDto {
  @IsUUID()
  @IsNotEmpty()
  newGalleryId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  reason: string;
}
