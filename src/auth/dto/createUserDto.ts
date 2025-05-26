import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(100, { message: 'Max Length 100' })
  name: string;

  @IsString()
  @MaxLength(100, { message: 'Max Length 100' })
  email: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
