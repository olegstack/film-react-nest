import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderRequestDto, OrderResponseDto } from './dto/order.dto';
import { plainToInstance } from 'class-transformer';

@Controller('order')
export class OrderController {
  constructor(private readonly orders: OrderService) {}

  //POST/order
  @Post()
  async create(@Body() dto: OrderRequestDto): Promise<OrderResponseDto> {
    const raw = await this.orders.create(dto);
    // Приводим ответ к DTO и уважаем @Expose
    return plainToInstance(OrderResponseDto, raw, {
      excludeExtraneousValues: true,
    });
  }
}
