import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Require Name' })
  @IsString()
  @MaxLength(100, { message: 'Max Length 100' })
  name: string;

  @IsNotEmpty({ message: 'Require Email' })
  @IsString()
  @MaxLength(100, { message: 'Max Length 100' })
  email: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
