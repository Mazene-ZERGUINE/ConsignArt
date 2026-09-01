import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../shared/decorators/public.decorator';

@ApiTags('Health')
@Controller('/health')
export class HealthController {
  @Public()
  @ApiResponse({
    description: 'Health check returns 200 status OK when called with success',
  })
  @ApiOperation({
    description: 'Health check',
  })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  public async healthCheck(): Promise<{ status: string }> {
    return Promise.resolve({ status: 'server is live' });
  }
}
