import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAccessGuard } from '../../core/guards/jwt-access.guard';
import { AuthUser } from '../../shared/decorators/authenticated-user.decorator';
import { type AuthenticatedUser } from '../../core/types/authenticated-user.types';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SaleResponseDto } from './dto/sale-response.dto';
import { CreateSaleService } from './services/create-sale.service';
import { GetSalesService } from './services/get-sales.service';

@ApiTags('sales')
@ApiBearerAuth()
@Controller('sales')
export class SellContractsController {
  constructor(
    private readonly createSale: CreateSaleService,
    private readonly getSales: GetSalesService,
  ) {}

  @UseGuards(JwtAccessGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    description:
      'Endpoint used by the owning gallery or an admin to record the sale of an art work to a collector (computes the gallery commission, the artist balance, generates the invoice/receipt and marks the art work as sold)',
  })
  public async create(
    @AuthUser() requester: AuthenticatedUser,
    @Body() dto: CreateSaleDto,
  ): Promise<SaleResponseDto> {
    return this.createSale.execute(requester, dto);
  }

  @UseGuards(JwtAccessGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      'Endpoint used to list sales scoped to the caller (admin: all, gallery/artist: own art works, collector: own purchases)',
  })
  public async findAll(@AuthUser() requester: AuthenticatedUser): Promise<SaleResponseDto[]> {
    return this.getSales.list(requester);
  }

  @UseGuards(JwtAccessGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Endpoint used to read a single sale by id (scoped to the caller)',
  })
  public async findOne(
    @AuthUser() requester: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SaleResponseDto> {
    return this.getSales.getOne(requester, id);
  }
}
