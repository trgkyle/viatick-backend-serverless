import { HttpException, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DynamooseModule } from 'nestjs-dynamoose';
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.module';
import { ConfigModule } from '@nestjs/config';
import { SentryInterceptor, SentryModule } from '@ntegral/nestjs-sentry';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { UserSchema } from './user/entities/user.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SentryModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) =>
        configService.sentryConfig,
      inject: [ApiConfigService],
    }),
    DynamooseModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) => ({
        aws: configService.awsS3Config,
      }),
      inject: [ApiConfigService],
    }),
    DynamooseModule.forFeature([
      { name: 'viatick-react-native-backend', schema: UserSchema },
    ]),
  ],
  providers: [
    UserService,
    {
      provide: APP_INTERCEPTOR,
      useFactory: () =>
        new SentryInterceptor({
          filters: [
            {
              type: HttpException,
              filter: (exception: HttpException) => 500 > exception.getStatus(), // Only report 500 errors
            },
          ],
        }),
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
