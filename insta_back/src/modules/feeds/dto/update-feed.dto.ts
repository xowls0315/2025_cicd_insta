import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateFeedDto {
  @ApiPropertyOptional({ example: '수정된 설명', description: '변경할 피드 설명' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}
