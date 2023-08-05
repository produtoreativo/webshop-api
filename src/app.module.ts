import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalHttpModule } from './global-http/global-http.module';

@Module({
  imports: [
    GlobalHttpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
