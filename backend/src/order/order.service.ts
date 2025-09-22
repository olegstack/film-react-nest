// src/order/order.service.ts
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';

import {
  OrderItemResponseDto,
  OrderRequestDto,
  OrderResponseDto,
} from './dto/order.dto';
import { FILMS_REPO } from 'src/repository/token';
import { FilmsRepository } from 'src/repository/films-repository';

@Injectable()
export class OrderService {
  constructor(@Inject(FILMS_REPO) private readonly films: FilmsRepository) {}

  async create(dto: OrderRequestDto): Promise<OrderResponseDto> {
    if (!dto.tickets?.length) {
      throw new BadRequestException('tickets must be non-empty array');
    }

    const results: OrderItemResponseDto[] = [];

    for (const t of dto.tickets) {
      const seatKey = `${t.row}:${t.seat}`;

      // 1. Проверка фильма
      const film = await this.films.findById(t.film);
      if (!film) {
        throw new NotFoundException(`Film ${t.film} not found`);
      }

      // 2. Проверка сеанса
      const session = film.schedule.find((s) => s.id === t.session);
      if (!session) {
        throw new NotFoundException(`Session ${t.session} not found`);
      }

      // 3. Проверка диапазона мест
      if (
        t.row < 1 ||
        t.row > session.rows ||
        t.seat < 1 ||
        t.seat > session.seats
      ) {
        throw new BadRequestException('Seat is out of bounds');
      }

      // 4. Проверка занятости места
      if (session.taken?.includes(seatKey)) {
        throw new ConflictException('Seat already taken');
      }

      // 5. Пытаемся забронировать место
      const reserved = await this.films.addTakenSeatAtomic(
        t.film,
        t.session,
        seatKey,
      );
      if (!reserved) {
        throw new ConflictException('Seat already taken');
      }

      // 6. Добавляем в ответ
      results.push({
        film: t.film,
        session: t.session,
        row: t.row,
        seat: t.seat,
        status: 'created',
      });
    }

    return {
      total: results.length,
      items: results,
    };
  }
}
