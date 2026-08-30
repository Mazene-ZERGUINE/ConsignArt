import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAccessGuard } from '../../core/guards/jwt-access.guard';
import { GalleryRoleGuard } from '../../core/guards/gallery-role.guard';
import { ArtistRoleGuard } from '../../core/guards/artist-role.guard';
import { AdminRoleGuard } from '../../core/guards/admin-role.guard';
import { AuthUser } from '../../shared/decorators/authenticated-user.decorator';
import { type AuthenticatedUser } from '../../core/types/authenticated-user.types';
import { GalleryStatsResponseDto } from './dto/gallery-stats-response.dto';
import { ArtistStatsResponseDto } from './dto/artist-stats-response.dto';
import { AdminStatsResponseDto } from './dto/admin-stats-response.dto';
import { GetGalleryStatsService } from './services/get-gallery-stats.service';
import { GetArtistStatsService } from './services/get-artist-stats.service';
import { GetAdminStatsService } from './services/get-admin-stats.service';

@ApiTags('analytics')
@ApiBearerAuth()
@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly getGalleryStats: GetGalleryStatsService,
    private readonly getArtistStats: GetArtistStatsService,
    private readonly getAdminStats: GetAdminStatsService,
  ) {}

  @UseGuards(JwtAccessGuard, GalleryRoleGuard)
  @Get('gallery')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      'Endpoint used by a gallery to read its own dashboard: art works sold per month, total revenue, top 5 selling artists and rotation rate',
  })
  public async gallery(@AuthUser() requester: AuthenticatedUser): Promise<GalleryStatsResponseDto> {
    return this.getGalleryStats.execute(requester);
  }

  @UseGuards(JwtAccessGuard, ArtistRoleGuard)
  @Get('artist')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      'Endpoint used by an artist to read its own dashboard: total sales, commissions paid and art works still available',
  })
  public async artist(@AuthUser() requester: AuthenticatedUser): Promise<ArtistStatsResponseDto> {
    return this.getArtistStats.execute(requester);
  }

  @UseGuards(JwtAccessGuard, AdminRoleGuard)
  @Get('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      'Endpoint reserved to admins to read the platform-wide dashboard: active users, transaction volume and total platform commissions',
  })
  public async admin(): Promise<AdminStatsResponseDto> {
    return this.getAdminStats.execute();
  }
}
