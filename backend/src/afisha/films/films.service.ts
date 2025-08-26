import { Inject, Injectable } from '@nestjs/common';
import { FILMS_REPO, FilmsRepository } from 'src/repository/films.repository';

@Injectable()
export class FilmsService {
  constructor(@Inject(FILMS_REPO) private repo: FilmsRepository) {}

  findAll() {
    return this.repo.findAll();
  }

  findSchedule(filmId: string) {
    return this.repo.findScheduleByFilmId(filmId);
  }
}
