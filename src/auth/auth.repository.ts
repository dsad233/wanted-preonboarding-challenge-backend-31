import { BaseRepository } from '@libs/database';
import { User } from '@libs/database/entities';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreateUserDto } from './dto/createUserDto';

@Injectable({ scope: Scope.REQUEST })
export class AuthRepository extends BaseRepository {
  constructor(
    @InjectDataSource('default') defaultDataSource: DataSource,
    @Inject(REQUEST) request: Request,
  ) {
    super(defaultDataSource, request);
  }

  // 한 명의 유저 조회
  async findOneUserEmail(email: string) {
    return await this.getRepository(User).findOneBy({
      email: email,
    });
  }

  // 유저 생성
  async createUser(createUserDto: CreateUserDto) {
    const user = this.getRepository(User).create({
      ...createUserDto,
    });

    await this.getRepository(User).save(user);
  }
}
