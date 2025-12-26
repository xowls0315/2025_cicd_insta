import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feed } from './entities/feed.entity';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { SupabaseService } from 'src/infra/supabase/supabase.service';
import type { Multer } from 'multer';

@Injectable()
export class FeedsService {
  constructor(
    @InjectRepository(Feed) private feedsRepo: Repository<Feed>,
    private supabaseService: SupabaseService,
  ) {}

  async create(userId: number, dto: CreateFeedDto, file: Multer.File) {
    if (!file) {
      throw new BadRequestException('사진은 필수입니다.');
    }

    const uploaded = await this.supabaseService.uploadFeedImage(file);

    const feed = this.feedsRepo.create({
      userId,
      photoUrl: uploaded.publicUrl,
      description: dto.description,
    });

    await this.feedsRepo.save(feed);

    return {
      id: feed.id,
      photoUrl: feed.photoUrl,
      description: feed.description,
      createdAt: feed.createdAt,
      updatedAt: feed.updatedAt,
    };
  }

  async findAllByUserId(userId: number) {
    const feeds = await this.feedsRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return feeds.map((feed) => ({
      id: feed.id,
      photoUrl: feed.photoUrl,
      description: feed.description,
      createdAt: feed.createdAt,
      updatedAt: feed.updatedAt,
    }));
  }

  async findOne(id: number, userId: number) {
    const feed = await this.feedsRepo.findOne({
      where: { id, userId },
    });

    if (!feed) {
      throw new NotFoundException('피드를 찾을 수 없습니다.');
    }

    return {
      id: feed.id,
      photoUrl: feed.photoUrl,
      description: feed.description,
      createdAt: feed.createdAt,
      updatedAt: feed.updatedAt,
    };
  }

  async update(
    id: number,
    userId: number,
    dto: UpdateFeedDto,
    file?: Multer.File,
  ) {
    const feed = await this.feedsRepo.findOne({
      where: { id, userId },
    });

    if (!feed) {
      throw new NotFoundException('피드를 찾을 수 없습니다.');
    }

    // 설명 업데이트
    if (dto.description !== undefined) {
      feed.description = dto.description;
    }

    // 사진 업데이트
    if (file) {
      // 기존 이미지 삭제 (경로 추출)
      const oldPath = feed.photoUrl.split('/').slice(-2).join('/');
      try {
        await this.supabaseService.deleteFile(`feeds/${oldPath}`);
      } catch (error) {
        // 삭제 실패해도 계속 진행
        console.error('Failed to delete old image:', error);
      }

      const uploaded = await this.supabaseService.uploadFeedImage(file);
      feed.photoUrl = uploaded.publicUrl;
    }

    feed.updatedAt = new Date();
    await this.feedsRepo.save(feed);

    return {
      id: feed.id,
      photoUrl: feed.photoUrl,
      description: feed.description,
      createdAt: feed.createdAt,
      updatedAt: feed.updatedAt,
    };
  }

  async remove(id: number, userId: number) {
    const feed = await this.feedsRepo.findOne({
      where: { id, userId },
    });

    if (!feed) {
      throw new NotFoundException('피드를 찾을 수 없습니다.');
    }

    // Supabase에서 이미지 삭제
    try {
      const path = feed.photoUrl.split('/').slice(-2).join('/');
      await this.supabaseService.deleteFile(`feeds/${path}`);
    } catch (error) {
      console.error('Failed to delete image:', error);
    }

    await this.feedsRepo.remove(feed);
    return { ok: true };
  }
}
