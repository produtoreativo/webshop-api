import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GlobalHttpModule } from './global-http/global-http.module';
import { ConfigModule } from '@nestjs/config';
import { GroupBuyingModule } from './group-buying/group-buying.module';
import orderConfig from '@config/order.config';
import { CatalogoModule } from './catalogo/catalogo.module';

const isTest = process.env.NODE_ENV === 'test' || process.env.DD_ENV === 'test';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [orderConfig],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: isTest
          ? undefined
          : {
              targets: [
                {
                  target: 'pino-pretty',
                  options: { colorize: true },
                },
                {
                  target: 'pino-datadog-transport',
                  options: {
                    ddClientConf: {
                      authMethods: {
                        apiKeyAuth: process.env.DD_API_KEY,
                      },
                    },
                  },
                  level: 'trace',
                },
              ],
            },
      },
    }),
    GlobalHttpModule,
    AuthModule,
    GroupBuyingModule,
    CatalogoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
