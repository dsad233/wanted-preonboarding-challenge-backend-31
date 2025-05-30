import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/middlewares/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

declare const module: any;

async function bootstrap() {
  // logger 로그 레벨 참고: https://cdragon.tistory.com/entry/NestJS-Logging-%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0-feat-winston
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn', 'log']
        : ['error', 'warn', 'log', 'verbose', 'debug'],
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
