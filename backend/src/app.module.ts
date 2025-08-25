import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'node:path';
import { configProvider } from './app.config.provider';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { FilmsModule } from './afisha/films/films.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    //конфиг (env)
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),

    // подключение к MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        uri: cfg.get<string>('MONGO_URI') || 'mongodb://localhost:27017/film',
      }),
    }),

    // статика
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'public', 'content', 'afisha'), //папка с файлами
      serveRoot: '/content/afisha',
    }),

    // модуль фильмов (контроллер + сервис + модель)
    FilmsModule,
    OrderModule,
  ],

  controllers: [],
  providers: [configProvider],
})
export class AppModule {}
