import { IsString, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username: string;

  @IsString()
  @MinLength(1)
  @MaxLength(30)
  nickname: string;

  @IsString()
  @MinLength(6, { message: '비밀번호는 6자 이상이어야 합니다.' })
  @MaxLength(100)
  newPassword: string;

  @IsString()
  @MinLength(6)
  @MaxLength(100)
  newPasswordConfirm: string;
}
