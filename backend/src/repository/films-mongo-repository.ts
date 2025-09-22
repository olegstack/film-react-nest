import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, FilmDocument } from 'src/afisha/films/schemas/film.schema';
import { FilmsRepository } from './films-repository';

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
    // добавляем место в массив выбранного сеанса
    const res = await this.filmModel.updateOne(
      { id: filmId, 'schedule.id': sessionId },
      { $addToSet: { 'schedule.$[s].taken': seatKey } },
      { arrayFilters: [{ 's.id': sessionId }] },
    );
    return res.modifiedCount > 0;
  }
}
