import {
  Exclude,
  Expose,
  Transform,
  TransformFnParams,
} from 'class-transformer';
import { IsEmail, IsUUID } from 'class-validator';

@Exclude()
export class UserPayloadDto {
  @Expose()
  @IsUUID()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  id: string;

  @Expose()
  @IsEmail()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  email: string;
}
