import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  async findAll() {
    const user = await this.authRepository.findAll();
    return { data: user };
  }
}
