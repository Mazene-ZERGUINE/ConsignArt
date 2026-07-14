import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '../../shared/decorators/authenticated-user.decorator';
import { type AuthenticatedUser } from '../../core/types/authenticated-user.types';
import { CreateArtistDto } from './dto/create-artist.dto';
import { AddArtistToGalleryService } from './services/add-artist-to-gallery.service';
import { GalleryRoleGuard } from '../../core/guards/gallery-role.guard';
import { JwtAccessGuard } from '../../core/guards/jwt-access.guard';

@ApiTags('Gallery')
@Controller('gallery')
export class GalleryController {
  constructor(private readonly addArtistToGallery: AddArtistToGalleryService) {}

  @UseGuards(JwtAccessGuard, GalleryRoleGuard)
  @Post('add-artist')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      'Endpoint used to add a new artist account to a gallery (create the account + link it the gallery)',
  })
  public async addArtist(
    @AuthUser() galleryUser: AuthenticatedUser,
    @Body() createArtistDto: CreateArtistDto,
  ): Promise<void> {
    await this.addArtistToGallery.execute(galleryUser.userId, createArtistDto);
  }
}
