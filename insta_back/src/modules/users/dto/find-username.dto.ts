import { IsString, MaxLength, MinLength } from 'class-validator';

export class FindUsernameDto {
  @IsString()
  @MinLength(1, { message: '닉네임을 입력해주세요.' })
  @MaxLength(30)
  nickname: string;
}
