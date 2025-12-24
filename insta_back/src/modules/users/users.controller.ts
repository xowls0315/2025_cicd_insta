import {
  BadRequestException,
  Body,
  Controller,
  Get,
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

import { UsersService } from './users.service';
import { SignupDto } from './dto/signup.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import type { Multer } from 'multer';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('signup')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async signup(@UploadedFile() file: Multer.File, @Body() dto: SignupDto) {
    return this.usersService.signup(dto, file);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: Request) {
    const userId = (req as any).user.userId as number;
    if (!userId) throw new BadRequestException('no user in request');
    return this.usersService.getMe(userId);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async updateMe(
    @Req() req: Request,
    @Body() dto: UpdateProfileDto,
    @UploadedFile() file?: Multer.File,
  ) {
    const userId = (req as any).user.userId as number;
    if (!userId) throw new BadRequestException('no user in request');
    return this.usersService.updateMe(userId, dto, file);
  }
}
