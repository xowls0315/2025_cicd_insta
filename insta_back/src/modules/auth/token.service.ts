import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RefreshToken } from './entities/refresh-token.entity';

@Injectable()
export class TokenService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    @InjectRepository(RefreshToken) private rtRepo: Repository<RefreshToken>,
  ) {}

  signAccessToken(userId: number) {
    const secret = this.config.get<string>('JWT_ACCESS_SECRET') ?? '';
    const expiresIn = (this.config.get<string>('ACCESS_EXPIRES_IN') ??
      '3m') as JwtSignOptions['expiresIn'];

    return this.jwt.sign({ userId }, { secret, expiresIn });
  }

  signRefreshToken(userId: number) {
    const secret = this.config.get<string>('JWT_REFRESH_SECRET') ?? '';
    const expiresIn = (this.config.get<string>('REFRESH_EXPIRES_IN') ??
      '14d') as JwtSignOptions['expiresIn'];

    return this.jwt.sign({ userId }, { secret, expiresIn });
  }

  private refreshExpiryDate() {
    const days = 14;
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }

  async issueRefreshToken(userId: number) {
    const old = await this.rtRepo.find({ where: { userId, isRevoked: false } });
    if (old.length) {
      old.forEach((t) => (t.isRevoked = true));
      await this.rtRepo.save(old);
    }

    const refreshToken = this.signRefreshToken(userId);
    const tokenHash = await bcrypt.hash(refreshToken, 10);

    const row = this.rtRepo.create({
      userId,
      tokenHash,
      isRevoked: false,
      expiresAt: this.refreshExpiryDate(),
      createdAt: new Date(),
    });

    await this.rtRepo.save(row);
    return refreshToken;
  }

  async validateRefreshAndRotate(refreshToken: string) {
    let payload: any;

    try {
      payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET') ?? '',
      });
    } catch {
      throw new UnauthorizedException('refresh token invalid');
    }

    const userId = Number(payload.userId);
    if (!userId) throw new UnauthorizedException('refresh token invalid');

    const rows = await this.rtRepo.find({
      where: { userId, isRevoked: false },
      order: { id: 'DESC' },
      take: 10,
    });

    let matched: RefreshToken | null = null;
    for (const row of rows) {
      const ok = await bcrypt.compare(refreshToken, row.tokenHash);
      if (ok) {
        matched = row;
        break;
      }
    }

    if (!matched) throw new UnauthorizedException('refresh token invalid');
    if (matched.expiresAt < new Date())
      throw new UnauthorizedException('refresh token expired');

    matched.isRevoked = true;
    await this.rtRepo.save(matched);

    const newAccessToken = this.signAccessToken(userId);
    const newRefreshToken = await this.issueRefreshToken(userId);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async revokeRefreshToken(refreshToken: string) {
    // refresh 토큰을 복호화해서 userId 얻기
    let payload: any;
    try {
      payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET') ?? '',
      });
    } catch {
      // 토큰이 이미 깨져 있어도 로그아웃은 성공 처리(쿠키 삭제가 목적)
      return { ok: true };
    }

    const userId = Number(payload.userId);
    if (!userId) return { ok: true };

    // (간단 버전) 해당 user의 살아있는 refresh 토큰 전부 revoke
    const rows = await this.rtRepo.find({
      where: { userId, isRevoked: false },
    });
    if (!rows.length) return { ok: true };

    rows.forEach((r) => (r.isRevoked = true));
    await this.rtRepo.save(rows);

    return { ok: true };
  }
}
