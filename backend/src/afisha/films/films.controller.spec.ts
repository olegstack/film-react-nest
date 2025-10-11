import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmListResponseDto, SessionResponseDto } from './dto/films.dto';
import { plainToInstance } from 'class-transformer';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: FilmsService;

  const mockFilms = [
    { id: '1', title: 'Movie 1', rating: 8, description: 'desc', tags: [] },
    { id: '2', title: 'Movie 2', rating: 9, description: 'desc', tags: [] },
  ];

  const mockSchedule = [
    { id: 's1', daytime: '2025-10-05T10:00:00Z', hall: 1, price: 350 },
    { id: 's2', daytime: '2025-10-05T14:00:00Z', hall: 2, price: 400 },
  ];

  const mockFilmsService = {
    findAll: jest.fn().mockResolvedValue(mockFilms),
    findSchedule: jest.fn().mockResolvedValue(mockSchedule),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [{ provide: FilmsService, useValue: mockFilmsService }],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get<FilmsService>(FilmsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('должен быть определён', () => {
    expect(controller).toBeDefined();
  });

  it('должен возвращать список фильмов', async () => {
    const result = await controller.findAll();

    // Проверяем вызов сервиса
    expect(service.findAll).toHaveBeenCalledTimes(1);

    // Проверяем структуру DTO
    const expected = plainToInstance(
      FilmListResponseDto,
      { total: mockFilms.length, items: mockFilms },
      { excludeExtraneousValues: true },
    );
    expect(result).toEqual(expected);
  });

  it('должен возвращать расписание фильма по id', async () => {
    const filmId = '1';
    const result = await controller.findOneSchedule(filmId);

    expect(service.findSchedule).toHaveBeenCalledWith(filmId);

    const expected = plainToInstance(
      SessionResponseDto,
      { total: mockSchedule.length, items: mockSchedule },
      { excludeExtraneousValues: true },
    );
    expect(result).toEqual(expected);
  });
});
