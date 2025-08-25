import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderRequestDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orders: OrderService) {}

  //POST/order
  @Post()
  async createBatch(@Body() body: OrderRequestDto) {
    const results = [];
    for (const t of body.tickets) {
      const res = await this.orders.create({
        filmId: t.film,
        sessionId: t.session,
        seat: { row: t.row, place: t.seat },
      });
      results.push(res);
    }
    return { items: results };
  }
}
