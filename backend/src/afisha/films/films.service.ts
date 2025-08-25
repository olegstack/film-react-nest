import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Film, FilmDocument } from './schemas/films.schema';
import { Model } from 'mongoose';

@Injectable()
export class FilmsService {
  constructor(@InjectModel(Film.name) private filmModel: Model<FilmDocument>) {}

  async findAll(): Promise<Film[]> {
    return this.filmModel.find().exec();
  }

  async findSchedule(id: string): Promise<Film> {
    const film = await this.filmModel.findOne({ id }).exec();
    if (!film) throw new NotFoundException(`Film ${id} not found`);
    return film;
  }
}
