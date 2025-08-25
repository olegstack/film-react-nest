import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Film, FilmDocument } from 'src/afisha/films/schemas/films.schema';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Film.name) private readonly filmModel: Model<FilmDocument>,
  ) {}

  async create(dto: CreateOrderDto) {
    const { filmId, sessionId, seat } = dto;
    const seatKey = `${seat.row}:${seat.place}`;

    // Найдем фильм и сеанс (для валидации)
    const film = await this.filmModel.findOne({ id: filmId }).lean();
    if (!film) {
      throw new NotFoundException(`Film ${filmId} not found`);
    }

    const session = film.schedule.find((s) => s.id === sessionId);
    if (!session) {
      throw new NotFoundException(`Session ${sessionId} not found`);
    }

    //Проверим, что место в допустимых пределах
    if (
      seat.row < 1 ||
      seat.row > session.rows ||
      seat.place < 1 ||
      seat.place > session.seats
    ) {
      throw new BadRequestException('Seat is out of bounds');
    }

    //Быстрая проверка на бронирования места
    if (session.taken?.includes(seatKey)) {
      throw new ConflictException('Seat already taken');
    }

    const upd = await this.filmModel.updateOne(
      { id: filmId, 'schedule.id': sessionId },
      { $addToSet: { 'schedule.$[s].taken': seatKey } },
      { arrayFilters: [{ 's.id': sessionId }] },
    );

    // modifiedCount === 0 то место уже было занято кем-то параллельно
    if (upd.modifiedCount === 0) {
      throw new ConflictException('Seat already taken');
    }

    //Вернем подтверждение
    return {
      filmId,
      sessionId,
      seat,
      status: 'created',
    };
  }
}
