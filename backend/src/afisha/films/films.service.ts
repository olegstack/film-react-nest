import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Film, FilmDocument } from './schemas/films.schema';
import { Model } from 'mongoose';
import * as path from 'node:path';
import * as fs from 'node:fs';

@Injectable()
export class FilmsService {
  private fallback: any[] | null = null;

  constructor(@InjectModel(Film.name) private filmModel: Model<FilmDocument>) {}

  private loadFallback() {
    if (this.fallback) return this.fallback;
    const p = path.join(process.cwd(), 'test', 'mongodb_initial_stub.json');
    try {
      const raw = fs.readFileSync(p, 'utf-8');
      this.fallback = JSON.parse(raw);
    } catch {
      this.fallback = [];
    }
    return this.fallback;
  }

  async findAll(): Promise<Film[]> {
    return this.filmModel.find().exec();
  }

  async findSchedule(id: string): Promise<Film> {
    const film = await this.filmModel.findOne({ id }).exec();
    if (!film) throw new NotFoundException(`Film ${id} not found`);
    return film;
  }
}
