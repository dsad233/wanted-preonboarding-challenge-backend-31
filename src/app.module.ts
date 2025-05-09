import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from '@libs/database';
import configuration from 'src/configs/configuration';
import { ValidationSchema } from './configs/validationSchema';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      cache: true,
      load: [configuration],
      validationSchema: ValidationSchema,
      validationOptions: {
        abortEarly: true,
      },
      // expandVariables: true, -> 환경 변수 '${}' 사용 여부
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      name: 'default',
      useClass: DatabaseConfig,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
