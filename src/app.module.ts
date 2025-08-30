import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GlobalHttpModule } from './global-http/global-http.module';
import { ConfigModule } from '@nestjs/config';
import { GroupBuyingModule } from './group-buying/group-buying.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot(),
    GlobalHttpModule,
    AuthModule,
    GroupBuyingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
