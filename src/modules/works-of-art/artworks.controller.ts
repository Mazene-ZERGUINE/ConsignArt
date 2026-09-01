import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '../../shared/decorators/authenticated-user.decorator';
import { type AuthenticatedUser } from '../../core/types/authenticated-user.types';
import { ArtWorkResponseDto } from './dto/art-work-response.dto';
import { UpdateArtWorkDto } from './dto/update-art-work.dto';
import { ChangeArtWorkStatusDto } from './dto/change-art-work-status.dto';
import { ArtWorkHistoryEntryDto } from './dto/art-work-history-entry.dto';
import { type ArtWorkStatus, ArtWorkStatusEnum } from '../../shared/enums/art-work-status.enum';
import { GetArtWorkService } from './services/get-art-work.service';
import { UpdateArtWorkService } from './services/update-art-work.service';
import { DeleteArtWorkService } from './services/delete-art-work.service';
import { ChangeArtWorkStatusService } from './services/change-art-work-status.service';
import { GetArtWorkHistoryService } from './services/get-art-work-history.service';
import { ParseFrenchDatePipe } from '../../core/pipes/parse-french-date.pipe';
import { ArtWorkNotSoldPipe } from './pipes/art-work-not-sold.pipe';
import { ArtWorkOwnershipGuard } from '../../core/guards/art-work-ownership.guard';
import { RequireArtWorkOwnership } from '../../shared/decorators/require-art-work-ownership.decorator';
import { ResponseCacheInterceptor } from '../../core/interceptors/response-cache.interceptor';

@ApiTags('artworks')
@Controller('artworks')
export class ArtworksController {
  constructor(
    private readonly getArtWork: GetArtWorkService,
    private readonly updateArtWork: UpdateArtWorkService,
    private readonly deleteArtWork: DeleteArtWorkService,
    private readonly changeArtWorkStatus: ChangeArtWorkStatusService,
    private readonly getArtWorkHistory: GetArtWorkHistoryService,
  ) {}

  @UseInterceptors(ResponseCacheInterceptor)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      'Endpoint used to list art works scoped to the caller (admin: all, gallery/artist: own, collector: available catalog), optionally filtered by ?status= and/or ?submittedAfter=JJ/MM/AAAA. Responses are cached per-user for 15s.',
  })
  public async findAll(
    @AuthUser() requester: AuthenticatedUser,
    @Query('status', new ParseEnumPipe(ArtWorkStatusEnum, { optional: true }))
    status?: ArtWorkStatus,
    @Query('submittedAfter', new ParseFrenchDatePipe()) submittedAfter?: string,
  ): Promise<ArtWorkResponseDto[]> {
    return this.getArtWork.list(requester, status, submittedAfter);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Endpoint used to read a single art work by id (scoped to the caller)',
  })
  public async findOne(
    @AuthUser() requester: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ArtWorkResponseDto> {
    return this.getArtWork.getOne(id);
  }

  @UseGuards(ArtWorkOwnershipGuard)
  @RequireArtWorkOwnership('gallery', 'artist')
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      'Endpoint used by the owning artist, the owning gallery or an admin to update an art work',
  })
  public async update(
    @AuthUser() requester: AuthenticatedUser,
    @Param('id', ParseUUIDPipe, ArtWorkNotSoldPipe) id: string,
    @Body() dto: UpdateArtWorkDto,
  ): Promise<ArtWorkResponseDto> {
    return this.updateArtWork.execute(requester, id, dto);
  }

  @UseGuards(ArtWorkOwnershipGuard)
  @RequireArtWorkOwnership('gallery', 'artist')
  @Get(':id/history')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      'Endpoint used by the owning artist, the owning gallery or an admin to read the status change history of an art work',
  })
  public async history(
    @AuthUser() requester: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ArtWorkHistoryEntryDto[]> {
    return this.getArtWorkHistory.execute(requester, id);
  }

  @UseGuards(ArtWorkOwnershipGuard)
  @RequireArtWorkOwnership('gallery')
  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      'Endpoint used by the owning gallery or an admin to change an art work status (change is tracked in history)',
  })
  public async updateStatus(
    @AuthUser() requester: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ChangeArtWorkStatusDto,
  ): Promise<ArtWorkResponseDto> {
    return this.changeArtWorkStatus.execute(requester, id, dto);
  }

  @UseGuards(ArtWorkOwnershipGuard)
  @RequireArtWorkOwnership('gallery', 'artist')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    description:
      'Endpoint used by the owning artist, the owning gallery or an admin to delete an art work (blocked when sold, on loan or in an exposition)',
  })
  public async remove(
    @AuthUser() requester: AuthenticatedUser,
    @Param('id', ParseUUIDPipe, ArtWorkNotSoldPipe) id: string,
  ): Promise<void> {
    await this.deleteArtWork.execute(requester, id);
  }
}
