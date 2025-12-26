import { Injectable, BadRequestException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import type { Multer } from 'multer';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  private bucket: string;

  constructor(private config: ConfigService) {
    const url = this.config.get<string>('SUPABASE_URL');
    const key = this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY');
    this.bucket = this.config.get<string>('SUPABASE_BUCKET') ?? 'photo';

    if (!url || !key) throw new Error('SUPABASE env missing');
    this.supabase = createClient(url, key);
  }

  async uploadProfileImage(file: Multer.File) {
    if (!file) throw new BadRequestException('file is required');

    const ext = file.originalname?.split('.').pop() ?? 'bin';
    const path = `profiles/${crypto.randomUUID()}.${ext}`;

    const { error } = await this.supabase.storage
      .from(this.bucket)
      .upload(path, file.buffer, { contentType: file.mimetype });

    if (error) throw new BadRequestException(error.message);

    const { data } = this.supabase.storage.from(this.bucket).getPublicUrl(path);
    return { path, publicUrl: data.publicUrl };
  }

  async uploadFeedImage(file: Multer.File) {
    if (!file) throw new BadRequestException('file is required');

    const ext = file.originalname?.split('.').pop() ?? 'bin';
    const path = `feeds/${crypto.randomUUID()}.${ext}`;

    const { error } = await this.supabase.storage
      .from(this.bucket)
      .upload(path, file.buffer, { contentType: file.mimetype });

    if (error) throw new BadRequestException(error.message);

    const { data } = this.supabase.storage.from(this.bucket).getPublicUrl(path);
    return { path, publicUrl: data.publicUrl };
  }

  async deleteFile(path: string) {
    const { error } = await this.supabase.storage
      .from(this.bucket)
      .remove([path]);
    if (error) throw new BadRequestException(error.message);
  }
}
