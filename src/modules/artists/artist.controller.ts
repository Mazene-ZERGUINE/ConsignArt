import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { JwtAccessGuard } from '../../core/guards/jwt-access.guard';
import { ArtistRoleGuard } from '../../core/guards/artist-role.guard';
import { AuthUser } from '../../shared/decorators/authenticated-user.decorator';
import { type AuthenticatedUser } from '../../core/types/authenticated-user.types';
import { CreateTransferRequestDto } from '../../shared/dto/create-transfer-request.dto';
import { InitiateTransferRequestService } from './services/initiate-transfer-request.service';
import { CreateArtWorkService } from '../works-of-art/services/create-art-work.service';
import { CreateArtWorkDto } from '../works-of-art/dto/create-art-work.dto';
import { GetArtworkByArtistService } from '../works-of-art/services/get-art-work-by-artist.service';
import { ArtWorkResponseDto } from '../works-of-art/dto/art-work-response.dto';

@ApiTags('artists')
@Controller('artists')
export class ArtistController {
  constructor(
    private readonly initiateTransferRequest: InitiateTransferRequestService,
    private readonly createArtWork: CreateArtWorkService,
    private readonly getArtistArtWorks: GetArtworkByArtistService,
  ) {}

  @UseGuards(JwtAccessGuard, ArtistRoleGuard)
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

  @UseGuards(JwtAccessGuard, ArtistRoleGuard)
  @Post('art-work/')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    description: 'Endpoint used to create a new art work by an artist',
  })
  async addArtWork(
    @AuthUser() user: AuthenticatedUser,
    @Body() createArtWorkDto: CreateArtWorkDto,
  ): Promise<void> {
    await this.createArtWork.execute(user.userId, createArtWorkDto);
  }

  @UseGuards(JwtAccessGuard, ArtistRoleGuard)
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
}
