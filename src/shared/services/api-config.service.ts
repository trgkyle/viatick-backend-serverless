import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SentryModuleOptions } from '@ntegral/nestjs-sentry';
import { isNil } from 'lodash';

@Injectable()
// eslint-disable-next-line
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replace(/\\n/g, '\n');
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV');
  }

  get isLambdaEnv() {
    return this.getBoolean('IS_LAMBDA_ENV');
  }

  get sentryConfig(): SentryModuleOptions {
    if (this.isLambdaEnv) {
      return {
        dsn: this.getString('SENTRY_IO_DSN'),
        debug: false,
        environment: this.getString('SENTRY_ENV'),
        release: 'v1',
        logLevels: ['error'],
      };
    }
    return {
      dsn: this.getString('SENTRY_IO_DSN'),
      debug: true,
      environment: this.getString('SENTRY_ENV'),
      release: 'v1',
      logLevels: ['error'],
    };
  }

  get awsS3Config() {
    if (this.isLambdaEnv) {
      return {
        accessKeyId: undefined,
        secretAccessKey: undefined,
        region: undefined,
      };
    }
    return {
      accessKeyId: this.getString('AWS_S3_ACCESS_KEY_ID'),
      secretAccessKey: this.getString('AWS_S3_SECRET_ACCESS_KEY'),
      region: this.getString('AWS_S3_REGION'),
    };
  }

  get appConfig() {
    return {
      port: this.getString('PORT'),
    };
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set'); // probably we should call process.exit() too to avoid locking the service
    }

    return value;
  }
}
