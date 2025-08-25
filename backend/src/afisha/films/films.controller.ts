import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { scheduled } from 'rxjs';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async findAll() {
    //Заглушка списка фильмов
    const items = await this.filmsService.findAll();
    return { total: items.length, items };
  }

  @Get(':id/schedule')
  async findOneSchedule(@Param('id') id: string) {
    //Заглушка фильма с расписанием
    const item = await this.filmsService.findSchedule(id);
    return { total: scheduled.length, items: item.schedule };
  }
}
