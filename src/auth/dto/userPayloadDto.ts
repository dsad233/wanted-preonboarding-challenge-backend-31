import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsUUID } from 'class-validator';

@Exclude()
export class UserPayloadDto {
  @Expose()
  @IsUUID()
  id: string;

  @Expose()
  @IsEmail()
  email: string;
}
