import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { FilmEntity } from '../entities/film.entity';
import { ScheduleEntity } from '../entities/schedule.entity';
import { Film, FilmSchema } from '../films/schemas/film.schema';

import { FilmsMongoRepository } from 'src/repository/films-mongo-repository';
import { FilmsPostgresRepository } from 'src/repository/films-postgres.repository';
import { FILMS_REPO } from 'src/repository/token';

@Global()
@Module({})
export class DatabaseModule {
  static forRootAsync(): DynamicModule {
    const driver = process.env.DATABASE_DRIVER || 'mongodb';

    const dynamicImports: any[] = [ConfigModule];
    const dynamicProviders: any[] = [];

    if (driver === 'postgres') {
      dynamicImports.push(
        //  Регистрируем репозитории TypeORM только в режиме postgres
        TypeOrmModule.forFeature([FilmEntity, ScheduleEntity]),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            type: 'postgres',
            host: config.get<string>('DATABASE_HOST'),
            port: Number(config.get<number>('DATABASE_PORT')),
            username: config.get<string>('DATABASE_USERNAME'),
            password: config.get<string>('DATABASE_PASSWORD'),
            database: config.get<string>('DATABASE_NAME'),
            entities: [FilmEntity, ScheduleEntity],
            synchronize: false,
          }),
        }),
      );

      dynamicProviders.push({
        provide: FILMS_REPO,
        useClass: FilmsPostgresRepository,
      });
    } else {
      dynamicImports.push(
        //  Регистрируем Mongoose-модель только в режиме mongodb
        MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            // Строка подключения собирается из env
            uri: `mongodb://${config.get<string>('DATABASE_URL')}:${config.get<number>('DATABASE_PORT')}/${config.get<string>('DATABASE_NAME')}`,
          }),
        }),
      );

      dynamicProviders.push({
        provide: FILMS_REPO,
        useClass: FilmsMongoRepository,
      });
    }

    return {
      module: DatabaseModule,
      imports: dynamicImports,
      providers: dynamicProviders,
      exports: dynamicProviders, // экспортируем провайдер с токеном
    };
  }
}
