import { Global, Module } from '@nestjs/common';

import { ApiConfigService } from './services/api-config.service';

@Global()
@Module({
  providers: [ApiConfigService],
  imports: [],
  exports: [ApiConfigService],
})
export class SharedModule {}
