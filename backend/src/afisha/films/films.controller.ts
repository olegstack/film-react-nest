import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmListResponseDto, SessionResponseDto } from './dto/films.dto';
import { plainToInstance } from 'class-transformer';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async findAll(): Promise<FilmListResponseDto> {
    const items = await this.filmsService.findAll();
    return plainToInstance(
      FilmListResponseDto,
      { total: items.length, items },
      { excludeExtraneousValues: true },
    );
  }

  @Get(':id/schedule')
  async findOneSchedule(@Param('id') id: string): Promise<SessionResponseDto> {
    const items = await this.filmsService.findSchedule(id);
    return plainToInstance(
      SessionResponseDto,
      { total: items.length, items },
      { excludeExtraneousValues: true },
    );
  }
}
