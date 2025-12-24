import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

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
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(dto);
    res.cookie('refreshToken', refreshToken, this.cookieOptionsForSet());
    return { accessToken };
  }

  @Post('refresh')
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
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.refreshToken;
    if (token) await this.authService.logout(token);

    // ✅ 생성할 때와 동일한 옵션으로 삭제
    res.clearCookie('refreshToken', this.cookieOptionsForClear());
    return { ok: true };
  }
}
