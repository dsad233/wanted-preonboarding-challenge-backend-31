import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ENTITY_MANAGER_KEY } from '../../../src/common/interceptors/transaction.interceptor';
import { DataSource, EntityManager, Repository } from 'typeorm';

@Injectable()
export abstract class BaseRepository {
  constructor(
    @InjectDataSource('default')
    private defaultDataSource: DataSource,
    private request: Request,
  ) {}

  protected getRepository<T>(entityCls: new () => T): Repository<T> {
    const entityManager: EntityManager =
      this.request[ENTITY_MANAGER_KEY] ?? this.defaultDataSource.manager;
    return entityManager.getRepository(entityCls);
  }
}
