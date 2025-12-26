import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateFeedDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}
