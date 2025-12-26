import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateFeedDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(2000)
  description: string;
}
