import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private tokenService: TokenService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersRepo.findOne({
      where: { username: dto.username },
    });
    if (!user)
      throw new UnauthorizedException('아이디/비밀번호를 확인해주세요.');

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('아이디/비밀번호를 확인해주세요.');

    const accessToken = this.tokenService.signAccessToken(user.id);
    const refreshToken = await this.tokenService.issueRefreshToken(user.id);

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    return this.tokenService.validateRefreshAndRotate(refreshToken);
  }

  async logout(refreshToken: string) {
    return this.tokenService.revokeRefreshToken(refreshToken);
  }
}
