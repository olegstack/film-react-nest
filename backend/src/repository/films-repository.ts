export interface SessionEntity {
  id: string;
  daytime: string;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}

export interface FilmType {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  image: string;
  cover: string;
  title: string;
  about: string;
  description: string;
  schedule: SessionEntity[];
}

export interface FilmsRepository {
  findAll(): Promise<FilmType[]>;
  findById(id: string): Promise<FilmType | null>;
  findScheduleByFilmId(id: string): Promise<SessionEntity[]>;
  addTakenSeatAtomic(
    filmId: string,
    sessionId: string,
    seatKey: string,
  ): Promise<boolean>;
}
