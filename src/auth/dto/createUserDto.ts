import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Require Name' })
  @IsString()
  @MaxLength(100, { message: 'Max Length 100' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name: string;

  @IsNotEmpty({ message: 'Require Email' })
  @IsEmail()
  @MaxLength(100, { message: 'Max Length 100' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  email: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  avatarUrl?: string;
}
