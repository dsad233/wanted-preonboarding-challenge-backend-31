import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  await app.listen(configService.getOrThrow<number>('port') ?? 3000);
  console.log(
    `현재 애플리케이션 실행 환경: ${configService.getOrThrow<number>('nodeEnv')}, ${configService.getOrThrow<number>('port')}`,
  );
}
bootstrap();
