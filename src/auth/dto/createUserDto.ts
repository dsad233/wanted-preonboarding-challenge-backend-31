import { User } from '@libs/database/entities';
import { PickType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';

export class CreateUserDto extends PickType(User, ['name', 'email']) {
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
