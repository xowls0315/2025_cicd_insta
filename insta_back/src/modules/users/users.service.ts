import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { SupabaseService } from 'src/infra/supabase/supabase.service';
import { SignupDto } from './dto/signup.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcrypt';
import type { Multer } from 'multer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private supabaseService: SupabaseService,
  ) {}

  async signup(dto: SignupDto, file?: Multer.File) {
    const { username, nickname, password, passwordConfirm } = dto;

    if (password !== passwordConfirm) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    const exists = await this.usersRepo.findOne({ where: { username } });
    if (exists) {
      throw new BadRequestException('이미 존재하는 아이디입니다.');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    let profileImageUrl: string | null = null;
    if (file) {
      const uploaded = await this.supabaseService.uploadProfileImage(file);
      profileImageUrl = uploaded.publicUrl;
    }

    const user = this.usersRepo.create({
      username,
      nickname,
      passwordHash,
      profileImageUrl,
    });

    await this.usersRepo.save(user);

    return { ok: true };
  }

  async getMe(userId: number) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('user not found');

    return {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      profileImageUrl: user.profileImageUrl,
    };
  }

  async findByUsername(username: string) {
    return this.usersRepo.findOne({ where: { username } });
  }

  async updateMe(userId: number, dto: UpdateProfileDto, file?: Multer.File) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('user not found');

    // username 변경 시 중복 체크
    if (dto.username && dto.username !== user.username) {
      const exists = await this.usersRepo.findOne({
        where: { username: dto.username },
      });
      if (exists) {
        throw new BadRequestException('이미 존재하는 아이디입니다.');
      }
      user.username = dto.username;
    }

    // nickname 업데이트
    if (dto.nickname) {
      user.nickname = dto.nickname;
    }

    // password 업데이트
    if (dto.password) {
      user.passwordHash = await bcrypt.hash(dto.password, 10);
    }

    // 프로필 이미지 업데이트
    if (file) {
      const uploaded = await this.supabaseService.uploadProfileImage(file);
      user.profileImageUrl = uploaded.publicUrl;
    }

    await this.usersRepo.save(user);

    return {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      profileImageUrl: user.profileImageUrl,
    };
  }
}
