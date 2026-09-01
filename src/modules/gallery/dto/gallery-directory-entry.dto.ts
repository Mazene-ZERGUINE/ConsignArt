import { ApiProperty } from '@nestjs/swagger';

export class GalleryDirectoryEntryDto {
  @ApiProperty({ description: "The gallery's user id, used as the transfer target id" })
  userId: string;

  @ApiProperty({ description: 'The gallery entity id' })
  entityId: string;

  @ApiProperty({ description: 'The gallery display name' })
  name: string;

  @ApiProperty({ description: 'The gallery contact email' })
  email: string;
}
