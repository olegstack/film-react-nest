import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async findAll() {
    //Заглушка списка фильмов
    const items = await this.filmsService.findAll();
    return { items };
  }

  @Get(':id/schedule')
  async findOneSchedule(@Param('id') id: string) {
    //Заглушка фильма с расписанием
    const item = await this.filmsService.findSchedule(id);
    return { items: item.schedule };
  }
}
