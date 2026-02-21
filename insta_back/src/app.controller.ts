import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: '루트', description: '서버 상태 확인' })
  @ApiResponse({ status: 200, description: 'Hello 메시지 반환' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: '헬스체크', description: 'DB 연결 확인. UptimeRobot 모니터링용' })
  @ApiResponse({ status: 200, description: '정상', schema: { properties: { status: { type: 'string', example: 'ok' } } } })
  async health() {
    return this.appService.healthCheck();
  }
}
