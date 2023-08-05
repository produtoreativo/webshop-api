import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    {
      ...HttpModule.register({
        timeout: 5000,
        maxRedirects: 5,
      }),
      global: true,
    },
  ],
  exports: [HttpModule],
})
export class GlobalHttpModule {}
