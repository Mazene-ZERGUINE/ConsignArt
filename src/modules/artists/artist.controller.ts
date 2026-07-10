import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAccessGuard } from '../../core/guards/jwt-access.guard';
import { ArtistRoleGuard } from '../../core/guards/artist-role.guard';
import { AuthUser } from '../../shared/decorators/authenticated-user.decorator';
import { type AuthenticatedUser } from '../../core/types/authenticated-user.types';
import { CreateTransferRequestDto } from '../../shared/dto/create-transfer-request.dto';
import { InitiateTransferRequestService } from './services/initiate-transfer-request.service';

@ApiTags('artists')
@Controller('artists')
export class ArtistController {
  constructor(private readonly initiateTransferRequest: InitiateTransferRequestService) {}

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
}
