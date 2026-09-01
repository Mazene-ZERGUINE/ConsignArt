import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { JwtAccessGuard } from '../../core/guards/jwt-access.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { UserRoles } from '../../shared/enums/user-roles.enum';
import { AuthUser } from '../../shared/decorators/authenticated-user.decorator';
import { type AuthenticatedUser } from '../../core/types/authenticated-user.types';
import { CreateTransferRequestDto } from '../../shared/dto/create-transfer-request.dto';
import { InitiateTransferRequestService } from './services/initiate-transfer-request.service';
import { CreateArtWorkDto } from '../works-of-art/dto/create-art-work.dto';
import { GetArtworkByArtistService } from '../works-of-art/services/get-art-work-by-artist.service';
import { ArtWorkResponseDto } from '../works-of-art/dto/art-work-response.dto';
import { AddArtworkService } from './services/add-art-work.service';
import { MaxActiveArtworksPipe } from '../../core/pipes/max-active-artworks.pipe';
import { GetArtistService } from './services/get-artist.service';
import { UpdateArtistService } from './services/update-artist.service';
import { ChangeArtistStatusService } from './services/change-artist-status.service';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ChangeArtistStatusDto } from './dto/change-artist-status.dto';
import { ArtistUserResponseDto } from './dto/artist-user-response.dto';

@ApiTags('artists')
@ApiBearerAuth()
@Controller('artists')
export class ArtistController {
  constructor(
    private readonly initiateTransferRequest: InitiateTransferRequestService,
    private readonly addArtWork: AddArtworkService,
    private readonly getArtistArtWorks: GetArtworkByArtistService,
    private readonly getArtist: GetArtistService,
    private readonly updateArtist: UpdateArtistService,
    private readonly changeArtistStatus: ChangeArtistStatusService,
  ) {}

  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRoles.ARTISTE)
  @Post('request-transfer')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    description: 'Endpoint used when artist request a transfer to another galelry',
  })
  public async requestTransfer(
    @AuthUser() artistUser: AuthenticatedUser,
    @Body() transferRequestDto: CreateTransferRequestDto,
  ): Promise<void> {
    await this.initiateTransferRequest.execute(artistUser.userId, transferRequestDto);
  }

  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRoles.ARTISTE)
  @Post('art-work/')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    description: 'Endpoint used to create a new art work by an artist',
  })
  async addNewArtWork(
    @AuthUser() user: AuthenticatedUser,
    @Body(MaxActiveArtworksPipe) createArtWorkDto: CreateArtWorkDto,
  ): Promise<void> {
    await this.addArtWork.execute(user.userId, createArtWorkDto);
  }

  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRoles.ARTISTE)
  @Get('art-works')
  @HttpCode(HttpStatus.OK)
  @ApiProperty({
    description: 'Endpoint used to return the users list of artWorks',
  })
  public async fetchArtWorksByArtist(
    @AuthUser() user: AuthenticatedUser,
  ): Promise<ArtWorkResponseDto[]> {
    return await this.getArtistArtWorks.execute(user.userId);
  }

  @UseGuards(JwtAccessGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      'Endpoint used by a gallery to list its own artists, or by an admin to list every artist',
  })
  public async findAll(): Promise<ArtistUserResponseDto[]> {
    return this.getArtist.list();
  }

  @UseGuards(JwtAccessGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      'Endpoint used by an admin, the owning gallery or the artist to read a single artist by user id',
  })
  public async findOne(
    @AuthUser() requester: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ArtistUserResponseDto> {
    return this.getArtist.getOne(requester, id);
  }

  @UseGuards(JwtAccessGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      'Endpoint used by an admin, the owning gallery or the artist to update the artist profile',
  })
  public async update(
    @AuthUser() requester: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateArtistDto,
  ): Promise<ArtistUserResponseDto> {
    return this.updateArtist.execute(requester, id, dto);
  }

  @UseGuards(JwtAccessGuard)
  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Endpoint used by an admin or the owning gallery to activate/deactivate an artist',
  })
  public async updateStatus(
    @AuthUser() requester: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ChangeArtistStatusDto,
  ): Promise<ArtistUserResponseDto> {
    return this.changeArtistStatus.execute(requester, id, dto);
  }
}
