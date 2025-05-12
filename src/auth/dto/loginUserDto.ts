import { User } from '@libs/database/entities';
import { PickType } from '@nestjs/mapped-types';

export class LoginUserDto extends PickType(User, ['name', 'email']) {}
