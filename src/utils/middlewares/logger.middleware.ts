import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// 참고: https://velog.io/@mero/NestJS-LoggerMiddleware-%EB%A1%9C-%EB%A1%9C%EA%B7%B8-%EB%82%A8%EA%B8%B0%EA%B8%B0
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      this.logger.log(
        `${req.ip} ${req.method} ${res.statusCode}`,
        req.originalUrl,
      );
    });

    next();
  }
}
