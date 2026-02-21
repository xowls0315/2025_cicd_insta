import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class FindUsernameDto {
  @ApiProperty({ example: '닉네임', description: '가입 시 사용한 닉네임' })
  @IsString()
  @MinLength(1, { message: '닉네임을 입력해주세요.' })
  @MaxLength(30)
  nickname: string;
}
