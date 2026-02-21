import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private config: ConfigService,
  ) {}

  private getCookieBase() {
    const secure = this.config.get<string>('COOKIE_SECURE') === 'true';
    return {
      httpOnly: true,
      secure,
      sameSite: secure ? ('none' as const) : ('lax' as const),
      path: '/',
    };
  }

  private cookieOptionsForSet() {
    return {
      ...this.getCookieBase(),
      maxAge: 14 * 24 * 60 * 60 * 1000,
    };
  }

  private cookieOptionsForClear() {
    // clearCookie는 maxAge 없어도 됨. (오히려 불필요)
    return this.getCookieBase();
  }

  @Post('login')
  @ApiOperation({ summary: '로그인', description: '아이디/비밀번호로 로그인. Access Token 반환, Refresh Token은 HttpOnly 쿠키로 설정' })
  @ApiResponse({ status: 201, description: '로그인 성공', schema: { properties: { data: { properties: { accessToken: { type: 'string' } } } } } })
  @ApiResponse({ status: 401, description: '아이디/비밀번호 불일치' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(dto);
    res.cookie('refreshToken', refreshToken, this.cookieOptionsForSet());
    return { accessToken };
  }

  @Post('refresh')
  @ApiOperation({ summary: '토큰 갱신', description: '쿠키의 Refresh Token으로 Access Token 갱신' })
  @ApiResponse({ status: 201, description: '갱신 성공', schema: { properties: { data: { properties: { accessToken: { type: 'string' } } } } } })
  @ApiResponse({ status: 401, description: 'Refresh Token 없음/만료/유효하지 않음' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies?.refreshToken;
    if (!token) throw new UnauthorizedException('refresh token missing');

    const { accessToken, refreshToken } = await this.authService.refresh(token);
    res.cookie('refreshToken', refreshToken, this.cookieOptionsForSet());
    return { accessToken };
  }

  @Post('logout')
  @ApiOperation({ summary: '로그아웃', description: 'Refresh Token 무효화 및 쿠키 삭제' })
  @ApiResponse({ status: 201, description: '로그아웃 성공', schema: { properties: { data: { properties: { ok: { type: 'boolean' } } } } } })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.refreshToken;
    if (token) await this.authService.logout(token);

    // ✅ 생성할 때와 동일한 옵션으로 삭제
    res.clearCookie('refreshToken', this.cookieOptionsForClear());
    return { ok: true };
  }
}
