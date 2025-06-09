import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/middlewares/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { winstonLogger } from './common/loggers/winston';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: winstonLogger,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  const configService = app.get(ConfigService);
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(configService.get<number>('port') ?? 3000);
  console.log(
    `현재 애플리케이션 실행 환경: ${configService.get<number>('nodeEnv')}, ${configService.get<number>('port')}`,
  );

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
