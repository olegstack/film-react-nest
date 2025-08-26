import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmListResponseDto, SessionResponseDto } from './dto/films.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async findAll(): Promise<FilmListResponseDto> {
    //Заглушка списка фильмов
    const items = await this.filmsService.findAll();
    return { total: items.length, items };
  }

  @Get(':id/schedule')
  async findOneSchedule(@Param('id') id: string): Promise<SessionResponseDto> {
    //Заглушка фильма с расписанием
    const items = await this.filmsService.findSchedule(id);
    return { total: items.length, items };
  }
}
