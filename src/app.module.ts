import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GlobalHttpModule } from './global-http/global-http.module';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { GroupBuyingModule } from './group-buying/group-buying.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GlobalHttpModule,
    AuthModule,
    ProductModule,
    GroupBuyingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
