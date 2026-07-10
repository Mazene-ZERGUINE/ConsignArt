import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateTransferRequestDto {
  @IsUUID()
  @IsNotEmpty()
  newGalleryId: string;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
