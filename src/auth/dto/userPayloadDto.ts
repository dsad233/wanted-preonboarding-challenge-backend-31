import { Exclude, Expose } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';

@Exclude()
export class UserPayloadDto {
  @Expose()
  @IsUUID()
  id: string;

  @Expose()
  @IsString()
  email: string;
}
