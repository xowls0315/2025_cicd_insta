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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { Request } from 'express';

import { UsersService } from './users.service';
import { SignupDto } from './dto/signup.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FindUsernameDto } from './dto/find-username.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import type { Multer } from 'multer';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('signup')
  @ApiOperation({ summary: '회원가입', description: '아이디, 닉네임, 비밀번호, 프로필 이미지로 회원가입 (multipart/form-data)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { username: { type: 'string' }, nickname: { type: 'string' }, password: { type: 'string' }, passwordConfirm: { type: 'string' }, file: { type: 'string', format: 'binary' } } } })
  @ApiResponse({ status: 201, description: '회원가입 성공' })
  @ApiResponse({ status: 400, description: '유효성 검사 실패' })
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async signup(@UploadedFile() file: Multer.File, @Body() dto: SignupDto) {
    return this.usersService.signup(dto, file);
  }

  @Post('find-username')
  @ApiOperation({ summary: '아이디 찾기', description: '닉네임으로 가입된 아이디(들) 조회' })
  @ApiResponse({ status: 201, description: '성공', schema: { properties: { data: { properties: { usernames: { type: 'array', items: { type: 'string' } } } } } } })
  @ApiResponse({ status: 400, description: '해당 닉네임으로 가입된 회원 없음' })
  async findUsername(@Body() dto: FindUsernameDto) {
    return this.usersService.findUsernameByNickname(dto);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.usersService.resetPassword(dto);
  }

  @Get('me')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '내 정보 조회', description: 'JWT Access Token으로 로그인한 사용자 정보 조회' })
  @ApiResponse({ status: 200, description: '성공', schema: { properties: { data: { properties: { id: {}, username: {}, nickname: {}, profileImageUrl: {} } } } } })
  @ApiResponse({ status: 401, description: '인증 필요' })
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: Request) {
    const userId = (req as any).user.userId as number;
    if (!userId) throw new BadRequestException('no user in request');
    return this.usersService.getMe(userId);
  }

  @Patch('me')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '프로필 수정', description: '아이디, 닉네임, 비밀번호, 프로필 이미지 수정 (multipart/form-data)' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: '수정 완료' })
  @ApiResponse({ status: 401, description: '인증 필요' })
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
