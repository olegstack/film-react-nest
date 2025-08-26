import { Expose, Type } from 'class-transformer';

//TODO описать DTO для запросов к /films
export class SessionDto {
  @Expose() id: string;
  @Expose() daytime: string;
  @Expose() hall: number;
  @Expose() rows: number;
  @Expose() seats: number;
  @Expose() price: number;
  @Expose() taken: string[];
}

export class FilmDto {
  @Expose() id: string;
  @Expose() rating: number;
  @Expose() director: string;
  @Expose() tags: string[];
  @Expose() image: string;
  @Expose() cover: string;
  @Expose() title: string;
  @Expose() about: string;
  @Expose() description: string;

  @Expose()
  @Type(() => SessionDto)
  schedule?: SessionDto[];
}

export class SessionResponseDto {
  @Expose() total: number;

  @Expose()
  @Type(() => SessionDto)
  items: SessionDto[];
}

export class FilmListResponseDto {
  @Expose() total: number;

  @Expose()
  @Type(() => FilmDto)
  items: FilmDto[];
}
