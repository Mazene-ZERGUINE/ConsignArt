import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../shared/decorators/roles.decorator';
import { UserRoles } from '../../shared/enums/user-roles.enum';
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

  @Roles(UserRoles.GALLERY)
  @Get('gallery')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      'Endpoint used by a gallery to read its own dashboard: art works sold per month, total revenue, top 5 selling artists and rotation rate',
  })
  public async gallery(@AuthUser() requester: AuthenticatedUser): Promise<GalleryStatsResponseDto> {
    return this.getGalleryStats.execute(requester);
  }

  @Roles(UserRoles.ARTISTE)
  @Get('artist')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      'Endpoint used by an artist to read its own dashboard: total sales, commissions paid and art works still available',
  })
  public async artist(@AuthUser() requester: AuthenticatedUser): Promise<ArtistStatsResponseDto> {
    return this.getArtistStats.execute(requester);
  }

  @Roles(UserRoles.ADMIN)
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
