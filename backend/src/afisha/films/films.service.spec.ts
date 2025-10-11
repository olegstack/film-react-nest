import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { FILMS_REPO } from 'src/repository/token';
import {
  FilmsRepository,
  FilmType,
  SessionEntity,
} from 'src/repository/films-repository';

describe('FilmsService', () => {
  let service: FilmsService;
  let mockRepo: jest.Mocked<FilmsRepository>;

  beforeEach(async () => {
    // создаём мок-репозиторий с заглушками для всех методов
    mockRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findScheduleByFilmId: jest.fn(),
      addTakenSeatAtomic: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [FilmsService, { provide: FILMS_REPO, useValue: mockRepo }],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
  });

  it('должен быть определён', () => {
    expect(service).toBeDefined();
  });

  it('должен вызывать repo.findAll() при вызове findAll()', async () => {
    const mockFilms: FilmType[] = [
      {
        id: '1',
        rating: 8,
        director: 'John Doe',
        tags: ['drama'],
        image: 'img1.jpg',
        cover: 'cover1.jpg',
        title: 'Film 1',
        about: 'About film 1',
        description: 'Description of film 1',
        schedule: [],
      },
      {
        id: '2',
        rating: 7,
        director: 'Jane Smith',
        tags: ['action'],
        image: 'img2.jpg',
        cover: 'cover2.jpg',
        title: 'Film 2',
        about: 'About film 2',
        description: 'Description of film 2',
        schedule: [],
      },
    ];

    mockRepo.findAll.mockResolvedValue(mockFilms);

    const result = await service.findAll();

    expect(mockRepo.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockFilms);
  });

  it('должен вызывать repo.findScheduleByFilmId() при вызове findSchedule()', async () => {
    const mockSchedule: SessionEntity[] = [
      {
        id: 's1',
        daytime: '2025-10-05T10:00:00Z',
        hall: 1,
        rows: 5,
        seats: 10,
        price: 350,
        taken: [],
      },
      {
        id: 's2',
        daytime: '2025-10-05T14:00:00Z',
        hall: 2,
        rows: 5,
        seats: 10,
        price: 400,
        taken: ['A1'],
      },
    ];

    mockRepo.findScheduleByFilmId.mockResolvedValue(mockSchedule);

    const result = await service.findSchedule('1');

    expect(mockRepo.findScheduleByFilmId).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockSchedule);
  });
});
