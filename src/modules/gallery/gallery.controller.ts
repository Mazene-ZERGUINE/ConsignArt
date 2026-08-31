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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '../../shared/decorators/authenticated-user.decorator';
import { type AuthenticatedUser } from '../../core/types/authenticated-user.types';
import { CreateArtistDto } from './dto/create-artist.dto';
import { AddArtistToGalleryService } from './services/add-artist-to-gallery.service';
import { GalleryRoleGuard } from '../../core/guards/gallery-role.guard';
import { JwtAccessGuard } from '../../core/guards/jwt-access.guard';
import { AdminRoleGuard } from '../../core/guards/admin-role.guard';
import { GetGalleryService } from './services/get-gallery.service';
import { UpdateGalleryService } from './services/update-gallery.service';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { GalleryUserResponseDto } from '../../shared/dto/base-user-response.dto';

@ApiTags('Gallery')
@ApiBearerAuth()
@Controller('gallery')
export class GalleryController {
  constructor(
    private readonly addArtistToGallery: AddArtistToGalleryService,
    private readonly getGallery: GetGalleryService,
    private readonly updateGallery: UpdateGalleryService,
  ) {}

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

  @UseGuards(JwtAccessGuard, AdminRoleGuard)
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

  @UseGuards(JwtAccessGuard)
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

  @UseGuards(JwtAccessGuard)
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
