import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as path from 'node:path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FilmsModule } from './afisha/films/films.module';
import { OrderModule } from './order/order.module';
import { DatabaseModule } from './afisha/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),

    DatabaseModule.forRootAsync(),

    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
    }),

    FilmsModule,
    OrderModule,
  ],
})
export class AppModule {}
