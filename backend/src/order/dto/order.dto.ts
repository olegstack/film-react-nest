import { Type } from 'class-transformer';
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

class SeatDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  row: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  place: number;
}

export class CreateOrderDto {
  @IsString()
  filmId: string;

  @IsString()
  sessionId: string;

  @ValidateNested()
  @Type(() => SeatDto)
  seat: SeatDto;
}
