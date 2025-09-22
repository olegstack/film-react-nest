import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FilmEntity } from 'src/afisha/entities/film.entity';
import { ScheduleEntity } from 'src/afisha/entities/schedule.entity';
import { FilmsRepository, FilmType, SessionEntity } from './films-repository';

const toSession = (s: ScheduleEntity): SessionEntity => ({
  id: s.id,
  daytime:
    typeof s.daytime === 'string'
      ? s.daytime
      : new Date(s.daytime as any).toISOString(),
  hall: Number(s.hall ?? 0),
  rows: Number(s.rows ?? 0),
  seats: Number(s.seats ?? 0),
  price: Number(s.price ?? 0),
  taken: Array.isArray((s as any).taken)
    ? (s as any).taken
    : s.taken
      ? String(s.taken).split(',').filter(Boolean)
      : [],
});

@Injectable()
export class FilmsPostgresRepository implements FilmsRepository {
  constructor(
    @InjectRepository(FilmEntity)
    private readonly filmRepo: Repository<FilmEntity>,
    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepo: Repository<ScheduleEntity>,
  ) {}

  async findAll(): Promise<FilmType[]> {
    // Отдаём список фильмов без расписания
    const films = await this.filmRepo.find();
    return films.map((film) => ({
      ...film,
      schedule: [],
    }));
  }

  async findScheduleByFilmId(id: string): Promise<SessionEntity[]> {
    const schedules = await this.scheduleRepo.find({
      where: { filmId: id },
      order: { daytime: 'ASC' },
    });
    return (schedules ?? []).map(toSession);
  }

  async findById(id: string): Promise<FilmType | null> {
    const film = await this.filmRepo.findOne({ where: { id } });
    if (!film) return null;
    const schedules = await this.scheduleRepo.find({ where: { filmId: id } });
    return { ...film, schedule: (schedules ?? []).map(toSession) };
  }

  async addTakenSeatAtomic(
    filmId: string,
    sessionId: string,
    seatKey: string,
  ): Promise<boolean> {
    const schedule = await this.scheduleRepo.findOne({
      where: { id: sessionId },
    });
    if (!schedule) return false;

    const takenArr = schedule.taken
      ? schedule.taken.split(',').filter(Boolean)
      : [];
    if (takenArr.includes(seatKey)) return false;

    takenArr.push(seatKey);
    schedule.taken = takenArr.join(',');
    await this.scheduleRepo.save(schedule);
    return true;
  }
}
