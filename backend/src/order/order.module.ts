import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { FilmsModule } from 'src/afisha/films/films.module';

@Module({
  imports: [FilmsModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
