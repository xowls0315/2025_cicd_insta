import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { Request } from 'express';

import { FeedsService } from './feeds.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import type { Multer } from 'multer';

@ApiTags('feeds')
@ApiBearerAuth('access-token')
@Controller('feeds')
@UseGuards(JwtAuthGuard)
export class FeedsController {
  constructor(private feedsService: FeedsService) {}

  @Post()
  @ApiOperation({ summary: '피드 생성', description: '사진과 설명으로 새 피드 작성 (multipart/form-data: file, description)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { description: { type: 'string' }, file: { type: 'string', format: 'binary' } }, required: ['description', 'file'] } })
  @ApiResponse({ status: 201, description: '피드 생성 완료' })
  @ApiResponse({ status: 401, description: '인증 필요' })
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async create(
    @Req() req: Request,
    @Body() dto: CreateFeedDto,
    @UploadedFile() file?: Multer.File,
  ) {
    const userId = (req as any).user.userId as number;
    if (!userId) throw new BadRequestException('no user in request');
    return this.feedsService.create(userId, dto, file!);
  }

  @Get('me')
  @ApiOperation({ summary: '내 피드 목록', description: '로그인한 사용자의 피드 목록 조회' })
  @ApiResponse({ status: 200, description: '피드 배열 반환' })
  @ApiResponse({ status: 401, description: '인증 필요' })
  async findAllByUserId(@Req() req: Request) {
    const userId = (req as any).user.userId as number;
    if (!userId) throw new BadRequestException('no user in request');
    return this.feedsService.findAllByUserId(userId);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: '피드 ID' })
  @ApiOperation({ summary: '피드 상세 조회', description: '특정 피드 상세 정보 조회' })
  @ApiResponse({ status: 200, description: '피드 상세 반환' })
  @ApiResponse({ status: 401, description: '인증 필요' })
  @ApiResponse({ status: 404, description: '피드 없음' })
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as any).user.userId as number;
    if (!userId) throw new BadRequestException('no user in request');
    return this.feedsService.findOne(+id, userId);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: '피드 ID' })
  @ApiOperation({ summary: '피드 수정', description: '피드 설명/이미지 수정 (multipart/form-data: description, file)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { description: { type: 'string' }, file: { type: 'string', format: 'binary' } } } })
  @ApiResponse({ status: 200, description: '수정 완료' })
  @ApiResponse({ status: 401, description: '인증 필요' })
  @ApiResponse({ status: 404, description: '피드 없음' })
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() dto: UpdateFeedDto,
    @UploadedFile() file?: Multer.File,
  ) {
    const userId = (req as any).user.userId as number;
    if (!userId) throw new BadRequestException('no user in request');
    return this.feedsService.update(+id, userId, dto, file);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: '피드 ID' })
  @ApiOperation({ summary: '피드 삭제', description: '피드 삭제 (본인 피드만 가능)' })
  @ApiResponse({ status: 200, description: '삭제 완료' })
  @ApiResponse({ status: 401, description: '인증 필요' })
  @ApiResponse({ status: 404, description: '피드 없음' })
  async remove(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as any).user.userId as number;
    if (!userId) throw new BadRequestException('no user in request');
    return this.feedsService.remove(+id, userId);
  }
}
