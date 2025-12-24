import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const auth = req.headers.authorization;

    if (!auth?.startsWith('Bearer ')) {
      throw new UnauthorizedException('missing bearer token');
    }

    const token = auth.split(' ')[1];
    try {
      const payload = await this.jwt.verifyAsync(token, {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
      });

      // ✅ 핵심: payload.userId를 쓴다
      const userId = Number(payload.userId);
      if (!userId) throw new UnauthorizedException('invalid token payload');

      (req as any).user = { userId };
      return true;
    } catch {
      throw new UnauthorizedException('invalid access token');
    }
  }
}
