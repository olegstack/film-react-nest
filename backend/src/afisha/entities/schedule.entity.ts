import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FilmEntity } from './film.entity';

@Entity('schedules')
export class ScheduleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  daytime: string;

  @Column({ type: 'int' })
  hall: number;

  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'int' })
  rows: number;

  @Column({ type: 'int' })
  seats: number;

  @Column({ type: 'text', default: '' })
  taken: string;

  @Column({ name: 'filmId', type: 'text' })
  filmId: string;

  @ManyToOne(() => FilmEntity, (film) => film.schedules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'filmId' })
  film: FilmEntity;
}
