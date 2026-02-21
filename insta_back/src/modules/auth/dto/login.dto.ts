import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'myuser', description: '아이디' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'password123', description: '비밀번호 (6자 이상)' })
  @IsString()
  @MinLength(6)
  password: string;
}
