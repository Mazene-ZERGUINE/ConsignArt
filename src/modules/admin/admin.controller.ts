import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidateGalleryAccountService } from './services/validate-gallery-account.service';
import { AuthUser } from '../../shared/decorators/authenticated-user.decorator';
import { type AuthenticatedUser } from '../../core/types/authenticated-user.types';
import { Roles } from '../../shared/decorators/roles.decorator';
import { UserRoles } from '../../shared/enums/user-roles.enum';
import {
  TransferRequestActionType,
  type TransferRequestStatus,
  TransferRequestStatusEnum,
} from '../../shared/enums/transfer-request.status.enum';
import { TransferRequestsResponseDto } from '../../shared/dto/transfer-requests-response.dto';
import { GetTransferRequestsService } from './services/get-transfer-requests.service';
import { AcceptOrRefuseTransferRequest } from './services/accept-or-refuse-transfer-request.service';
import { CreateAdminAccountService } from './services/create-admin-account.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UserResponseDto } from '../../shared/dto/base-user-response.dto';

@ApiTags('Admin')
@Roles(UserRoles.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly validateGalleryAccount: ValidateGalleryAccountService,
    private readonly getTransferRequests: GetTransferRequestsService,
    private readonly acceptOrRefuseTransferRequest: AcceptOrRefuseTransferRequest,
    private readonly createAdminAccount: CreateAdminAccountService,
  ) {}

  @Post('accounts')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    description:
      'Endpoint reserved to admins to create a new admin account. The password is randomly generated (5 words) and returned once in the response.',
  })
  public async create(@Body() dto: CreateAdminDto): Promise<{
    user: UserResponseDto;
    tempPassword: string;
  }> {
    return await this.createAdminAccount.execute(dto);
  }

  @Get('validate-gallery-account')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Endpoint used only by admin account in order to validate a gallery account',
  })
  public async validateGallery(
    @Query('galleryId', ParseUUIDPipe) galleryId: string,
    @AuthUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.validateGalleryAccount.execute(galleryId, user.userId);
  }

  @Get('transfer-requests')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Endpoint used for admins to view all transfer requests',
  })
  public async fetchTransferRequests(
    @Query('status', new ParseEnumPipe(TransferRequestStatusEnum))
    transferStatus: TransferRequestStatus,
  ): Promise<TransferRequestsResponseDto[]> {
    return await this.getTransferRequests.execute(transferStatus);
  }

  @Patch('transfer-requests/:id/action')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    description: 'Endpoint used by admins to accept or reject a transfer request',
  })
  public async handleTransferRequest(
    @Param('id') transferRequestId: string,
    @Query('actionType', new ParseEnumPipe(TransferRequestActionType))
    actionType: TransferRequestActionType,
  ): Promise<void> {
    await this.acceptOrRefuseTransferRequest.execute(transferRequestId, actionType);
  }
}
