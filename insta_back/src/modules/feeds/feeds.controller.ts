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
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { Request } from 'express';

import { FeedsService } from './feeds.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import type { Multer } from 'multer';

@Controller('feeds')
@UseGuards(JwtAuthGuard)
export class FeedsController {
  constructor(private feedsService: FeedsService) {}

  @Post()
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
  async findAllByUserId(@Req() req: Request) {
    const userId = (req as any).user.userId as number;
    if (!userId) throw new BadRequestException('no user in request');
    return this.feedsService.findAllByUserId(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as any).user.userId as number;
    if (!userId) throw new BadRequestException('no user in request');
    return this.feedsService.findOne(+id, userId);
  }

  @Patch(':id')
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
  async remove(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as any).user.userId as number;
    if (!userId) throw new BadRequestException('no user in request');
    return this.feedsService.remove(+id, userId);
  }
}
