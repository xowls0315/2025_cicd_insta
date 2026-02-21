import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class SignupDto {
  @ApiProperty({ example: 'myuser', description: '아이디 (3~30자)' })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username: string;

  @ApiProperty({ example: '닉네임', description: '닉네임 (1~30자)' })
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  nickname: string;

  @ApiProperty({ example: 'password123', description: '비밀번호 (6자 이상)' })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;

  @ApiProperty({ example: 'password123', description: '비밀번호 확인' })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  passwordConfirm: string;
}
