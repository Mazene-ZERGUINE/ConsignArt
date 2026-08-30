import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAccessGuard } from '../../../core/guards/jwt-access.guard';
import { AuthUser } from '../../../shared/decorators/authenticated-user.decorator';
import { type AuthenticatedUser } from '../../../core/types/authenticated-user.types';
import { CreateLoanDto } from './dto/create-loan.dto';
import { LoanResponseDto } from './dto/loan-response.dto';
import { CreateLoanService } from './services/create-loan.service';
import { GetLoansService } from './services/get-loans.service';

@ApiTags('loans')
@ApiBearerAuth()
@Controller('loans')
export class LoansController {
  constructor(
    private readonly createLoan: CreateLoanService,
    private readonly getLoans: GetLoansService,
  ) {}

  @UseGuards(JwtAccessGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    description:
      'Endpoint used by the owning gallery or an admin to lend an art work to another gallery for a temporary exposition (art work switches to on_loan)',
  })
  public async create(
    @AuthUser() requester: AuthenticatedUser,
    @Body() dto: CreateLoanDto,
  ): Promise<LoanResponseDto> {
    return this.createLoan.execute(requester, dto);
  }

  @UseGuards(JwtAccessGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      'Endpoint used to list loans scoped to the caller (admin: all, gallery: incoming/outgoing, artist: own art works, collector: none)',
  })
  public async findAll(@AuthUser() requester: AuthenticatedUser): Promise<LoanResponseDto[]> {
    return this.getLoans.list(requester);
  }

  @UseGuards(JwtAccessGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Endpoint used to read a single loan by id' })
  public async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<LoanResponseDto> {
    return this.getLoans.getOne(id);
  }
}
