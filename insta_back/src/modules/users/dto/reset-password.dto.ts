import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'myuser', description: '아이디' })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username: string;

  @ApiProperty({ example: '닉네임', description: '닉네임' })
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  nickname: string;

  @ApiProperty({ example: 'newpassword123', description: '새 비밀번호 (6자 이상)' })
  @IsString()
  @MinLength(6, { message: '비밀번호는 6자 이상이어야 합니다.' })
  @MaxLength(100)
  newPassword: string;

  @ApiProperty({ example: 'newpassword123', description: '새 비밀번호 확인' })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  newPasswordConfirm: string;
}
