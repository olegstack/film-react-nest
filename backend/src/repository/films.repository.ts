import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, FilmDocument } from 'src/afisha/films/schemas/film.schema';

export interface SessionEntity {
  id: string;
  daytime: string;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}

export interface FilmEntity {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  image: string;
  cover: string;
  title: string;
  about: string;
  description: string;
  schedule: SessionEntity[];
}

export interface FilmsRepository {
  findAll(): Promise<FilmEntity[]>;
  findById(id: string): Promise<FilmEntity | null>;
  findScheduleByFilmId(id: string): Promise<SessionEntity[]>;
  addTakenSeatAtomic(
    filmId: string,
    sessionId: string,
    seatKey: string,
  ): Promise<boolean>;
}

// DI‑токен
export const FILMS_REPO = Symbol('FILMS_REPO');

@Injectable()
export class FilmsMongoRepository implements FilmsRepository {
  // схема регистрируется в FilmsModule
  constructor(
    @InjectModel(Film.name) private readonly filmModel: Model<FilmDocument>,
  ) {}

  async findAll() {
    return this.filmModel.find().lean().exec();
  }

  async findById(id: string) {
    return this.filmModel.findOne({ id }).lean().exec();
  }

  async findScheduleByFilmId(id: string) {
    const film = await this.findById(id);
    return film?.schedule ?? [];
  }

  async addTakenSeatAtomic(filmId: string, sessionId: string, seatKey: string) {
    const res = await this.filmModel.updateOne(
      { id: filmId, 'schedule.id': sessionId },
      { $addToSet: { 'schedule.$[s].taken': seatKey } },
      { arrayFilters: [{ 's.id': sessionId }] },
    );
    return res.modifiedCount > 0;
  }
}
