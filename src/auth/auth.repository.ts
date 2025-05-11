import { BaseRepository } from '@libs/database';
import { User } from '@libs/database/entities';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class AuthRepository extends BaseRepository {
  constructor(
    @InjectDataSource('default') defaultDataSource: DataSource,
    @Inject(REQUEST) request: Request,
  ) {
    super(defaultDataSource, request);
  }

  // 유저 전체 조회
  async findAll() {
    return await this.getRepository(User).find();
  }
}
