import { Inject, Injectable } from '@nestjs/common';
import { FilmsRepository } from 'src/repository/films-repository';
import { FILMS_REPO } from 'src/repository/token';

@Injectable()
export class FilmsService {
  constructor(@Inject(FILMS_REPO) private readonly repo: FilmsRepository) {}

  findAll() {
    return this.repo.findAll();
  }

  findSchedule(filmId: string) {
    return this.repo.findScheduleByFilmId(filmId);
  }
}
