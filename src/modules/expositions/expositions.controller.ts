import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAccessGuard } from '../../core/guards/jwt-access.guard';
import { GalleryRoleGuard } from '../../core/guards/gallery-role.guard';
import { AuthUser } from '../../shared/decorators/authenticated-user.decorator';
import { type AuthenticatedUser } from '../../core/types/authenticated-user.types';
import { CreateExpositionDto } from './dto/create-exposition.dto';
import { UpdateExpositionDto } from './dto/update-exposition.dto';
import { ExpositionResponseDto } from './dto/exposition-response.dto';
import { CreateExpositionService } from './services/create-exposition.service';
import { GetExpositionService } from './services/get-exposition.service';
import { UpdateExpositionService } from './services/update-exposition.service';
import { CloseExpositionService } from './services/close-exposition.service';

@ApiTags('expositions')
@ApiBearerAuth()
@Controller('expositions')
export class ExpositionsController {
  constructor(
    private readonly createExposition: CreateExpositionService,
    private readonly getExposition: GetExpositionService,
    private readonly updateExposition: UpdateExpositionService,
    private readonly closeExposition: CloseExpositionService,
  ) {}

  @UseGuards(JwtAccessGuard, GalleryRoleGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    description:
      'Endpoint used by a gallery to organize an exposition with a non-empty list of its own available art works (they switch to on_loan for the duration of the exposition)',
  })
  public async create(
    @AuthUser() requester: AuthenticatedUser,
    @Body() dto: CreateExpositionDto,
  ): Promise<ExpositionResponseDto> {
    return this.createExposition.execute(requester, dto);
  }

  @UseGuards(JwtAccessGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      'Endpoint used to list expositions (gallery: own, everyone else: full catalog of expositions)',
  })
  public async findAll(@AuthUser() requester: AuthenticatedUser): Promise<ExpositionResponseDto[]> {
    return this.getExposition.list(requester);
  }

  @UseGuards(JwtAccessGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Endpoint used to read a single exposition by id' })
  public async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ExpositionResponseDto> {
    return this.getExposition.getOne(id);
  }

  @UseGuards(JwtAccessGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Endpoint used by the organizing gallery or an admin to update an exposition',
  })
  public async update(
    @AuthUser() requester: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateExpositionDto,
  ): Promise<ExpositionResponseDto> {
    return this.updateExposition.execute(requester, id, dto);
  }

  @UseGuards(JwtAccessGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    description:
      'Endpoint used by the organizing gallery or an admin to close an exposition (art works still on loan for it return to available)',
  })
  public async close(
    @AuthUser() requester: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.closeExposition.execute(requester, id);
  }
}
