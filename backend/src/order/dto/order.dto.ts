import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class TicketDto {
  @IsString()
  film: string;

  @IsString()
  session: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  row: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  seat: number;
}

export class OrderRequestDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketDto)
  tickets: TicketDto[];
}

export class OrderItemResponseDto {
  @Expose() film: string;
  @Expose() session: string;
  @Expose() row: number;
  @Expose() seat: number;
  @Expose() status: 'created';
}

export class OrderResponseDto {
  @Expose() total: number;

  @Expose()
  @Type(() => OrderItemResponseDto)
  items: OrderItemResponseDto[];
}
