import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'newuser', description: '변경할 아이디' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username?: string;

  @ApiPropertyOptional({ example: '새닉네임', description: '변경할 닉네임' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  nickname?: string;

  @ApiPropertyOptional({ example: 'newpassword', description: '변경할 비밀번호 (비워두면 미변경)' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password?: string;
}
