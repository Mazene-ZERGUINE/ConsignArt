import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidateGalleryAccountService } from './services/validate-gallery-account.service';
import { AuthUser } from '../../shared/decorators/authenticated-user.decorator';
import { type AuthenticatedUser } from '../../core/types/authenticated-user.types';
import { JwtAccessGuard } from '../../core/guards/jwt-access.guard';
import { AdminRoleGuard } from '../../core/guards/admin-role.guard';
import { type TransferRequestStatus } from '../../shared/enums/transfer-request.status.enum';
import { TransferRequestsResponseDto } from '../../shared/dto/transfer-requests-response.dto';
import { GetTransferRequestsService } from './services/get-transfer-requests.service';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly validateGalleryAccount: ValidateGalleryAccountService,
    private readonly getTransferRequests: GetTransferRequestsService,
  ) {}

  @UseGuards(JwtAccessGuard, AdminRoleGuard)
  @Get('validate-gallery-account')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Endpoint used only by admin account in order to validate a gallery account',
  })
  public async validateGallery(
    @Query('galleryId') galleryId: string,
    @AuthUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.validateGalleryAccount.execute(galleryId, user.userId);
  }

  @UseGuards(JwtAccessGuard, AdminRoleGuard)
  @Get('transfer-requests')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Endpoint used for admins to view all transfer requests',
  })
  public async fetchTransferRequests(
    @Query('status') transferStatus?: TransferRequestStatus,
  ): Promise<TransferRequestsResponseDto[]> {
    return await this.getTransferRequests.execute(transferStatus);
  }
}
