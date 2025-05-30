import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from '@libs/database';
import configuration from 'src/configs/configuration';
import { ValidationSchema } from './configs/validationSchema';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { JwtModule } from './jwt/jwt.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guard/auth.guard';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { ProductsModule } from './products/products.module';
import { ProductOptionsModule } from './product-options/product-options.module';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.production', '.env.development'],
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
    RedisModule,
    JwtModule,
    ProductsModule,
    ProductOptionsModule,
    ProductCategoriesModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
