import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseBoolPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '../../shared/decorators/authenticated-user.decorator';
import { type AuthenticatedUser } from '../../core/types/authenticated-user.types';
import { CreateArtistDto } from './dto/create-artist.dto';
import { AddArtistToGalleryService } from './services/add-artist-to-gallery.service';
import { Roles } from '../../shared/decorators/roles.decorator';
import { UserRoles } from '../../shared/enums/user-roles.enum';
import { GetGalleryService } from './services/get-gallery.service';
import { UpdateGalleryService } from './services/update-gallery.service';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { GalleryUserResponseDto } from '../../shared/dto/base-user-response.dto';
import { GalleryDirectoryEntryDto } from './dto/gallery-directory-entry.dto';

@ApiTags('Gallery')
@Controller('gallery')
export class GalleryController {
  constructor(
    private readonly addArtistToGallery: AddArtistToGalleryService,
    private readonly getGallery: GetGalleryService,
    private readonly updateGallery: UpdateGalleryService,
  ) {}

  @Roles(UserRoles.GALLERY)
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

  @Roles(UserRoles.ADMIN)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      'Endpoint reserved to admins to list galleries, optionally filtered to the ones still pending validation (?pending=true)',
  })
  public async findAll(
    @Query('pending', new ParseBoolPipe({ optional: true })) pending?: boolean,
  ): Promise<GalleryUserResponseDto[]> {
    return this.getGallery.list(pending);
  }

  @Get('directory')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      'Endpoint used to list validated galleries, so an artist can pick a transfer target or a gallery can pick a loan destination without knowing its id',
  })
  public async directory(): Promise<GalleryDirectoryEntryDto[]> {
    return this.getGallery.listValidated();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      'Endpoint used by an admin or by the gallery owner to read a single gallery by its user id',
  })
  public async findOne(
    @AuthUser() requester: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<GalleryUserResponseDto> {
    return this.getGallery.getOne(requester, id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Endpoint used by an admin or by the gallery owner to update the gallery name',
  })
  public async update(
    @AuthUser() requester: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateGalleryDto,
  ): Promise<GalleryUserResponseDto> {
    return this.updateGallery.execute(requester, id, dto);
  }
}
