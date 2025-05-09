import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, catchError, concatMap, finalize } from 'rxjs';
import { DataSource } from 'typeorm';

export const ENTITY_MANAGER_KEY = 'ENTITY_MANAGER';

@Injectable()
// 참조: https://cdragon.tistory.com/entry/NestJS-NestJS-%ED%8A%B8%EB%9E%9C%EC%9E%AD%EC%85%98Transaction-%EA%B4%80%EB%A6%AC%ED%95%98%EA%B8%B0With-TypeORM
export class TransactionInterceptor implements NestInterceptor {
  constructor(@Inject('default') private defaultDataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    // request 객체를 가져옵니다.
    const req = context.switchToHttp().getRequest<Request>();
    // transaction 시작
    const queryRunner = this.defaultDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    // attach query manager with transaction to the request
    req[ENTITY_MANAGER_KEY] = queryRunner.manager;

    return next.handle().pipe(
      // 라우트 핸들러가 성공적으로 완료될 때 concatMap이 호출됩니다.
      concatMap(async (data) => {
        await queryRunner.commitTransaction();
        return data;
      }),
      // 라우트 핸들러가 예외를 던질 떄 catchError가 호출됩니다.
      catchError(async (e) => {
        await queryRunner.rollbackTransaction();
        throw e;
      }),
      // 항상 마지막에 실행되는 부분으로 이곳에서 release가 이루어져야 어떠한
      // 상황에서도 release가 보장됩니다.
      finalize(async () => {
        await queryRunner.release();
      }),
    );
  }
}
