import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/middlewares/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { winstonLogger } from './common/loggers/winston';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
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

  // shutdown hooks에 대한 리스닝 -> Lifecycle 이벤트 사용시 설정 필요
  app.enableShutdownHooks();

  if (configService.get<string>('nodeEnv') === 'production') {
    // helmet 설정
    // 프로토콜 다운그레이드 공격, 쿠키 하이재킹 공격 차단
    app.use(
      helmet.hsts({
        maxAge: 90 * 24 * 60 * 60, // 90일동안 https 사용하도록
        includeSubDomains: true,
        preload: true,
      }),
    );

    // 컨텐츠 화이트 리스트
    app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            'script-src': [
              "'self'",
              '*.googleapis.com',
              "'unsafe-inline'",
              "'unsafe-eval'",
            ],

            // 다음과 카카오에서 이미지 소스를 허용
            'img-src': ["'self'", 'data:', '*.daumcdn.net', '*.kakaocdn.net'],

            // 소스에 https와 http 허용
            'base-uri': ['/', 'http:'],
          },
        },
      }),
    );
    // 서버 소프트웨어 정보 숨김
    app.use(helmet.hidePoweredBy());
    app.use(helmet.xssFilter());
    app.use(
      helmet.frameguard({
        action: 'deny',
      }),
    );
    app.use(helmet.noSniff());
    // app.set('trust proxy', 'loopback');
  }

  await app.listen(configService.get<number>('port') ?? 3000);
  console.log(
    `현재 애플리케이션 실행 환경: ${configService.get<string>('nodeEnv')}, ${configService.get<number>('port')}`,
  );

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
