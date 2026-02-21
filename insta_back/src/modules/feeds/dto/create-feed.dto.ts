import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateFeedDto {
  @ApiProperty({ example: '오늘의 일상 📸', description: '피드 설명 (최대 2000자)' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(2000)
  description: string;
}
