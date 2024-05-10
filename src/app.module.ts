import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GlobalHttpModule } from './global-http/global-http.module';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { OrderModule } from './order/order.module';
import { ApmModule } from 'elastic-apm-nest';

@Module({
  imports: [
    ApmModule.forRootAsync(),
    ConfigModule.forRoot({ isGlobal: true }),
    GlobalHttpModule,
    AuthModule,
    ProductModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
