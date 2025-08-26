import { MongooseModule } from '@nestjs/mongoose';
import { Film, FilmSchema } from './schemas/film.schema';
import { Module } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import {
  FILMS_REPO,
  FilmsMongoRepository,
} from 'src/repository/films.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
  ],
  controllers: [FilmsController],
  providers: [
    FilmsService,
    {
      provide: FILMS_REPO,
      useClass: FilmsMongoRepository,
    },
  ],
  exports: [FILMS_REPO, FilmsService],
})
export class FilmsModule {}
