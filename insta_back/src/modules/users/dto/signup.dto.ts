import { IsString, MaxLength, MinLength } from 'class-validator';

export class SignupDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username: string; // 아이디

  @IsString()
  @MinLength(1)
  @MaxLength(30)
  nickname: string;

  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;

  @IsString()
  @MinLength(6)
  @MaxLength(100)
  passwordConfirm: string;
}
