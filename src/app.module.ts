import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GlobalHttpModule } from './global-http/global-http.module';
import { AppService } from './app.service';

@Module({
  imports: [GlobalHttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
