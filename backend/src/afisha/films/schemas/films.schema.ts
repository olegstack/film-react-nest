import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Session, SessionSchema } from './session.schema';

@Schema()
export class Film {
  @Prop({ required: true })
  id: string;

  @Prop()
  rating: number;

  @Prop()
  director: string;

  @Prop([String])
  tags: string[];

  @Prop()
  image: string;

  @Prop()
  cover: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  about: string;

  @Prop()
  description: string;

  @Prop({ type: [SessionSchema], default: [] })
  schedule: Session[];
}

export type FilmDocument = Film & Document;
export const FilmSchema = SchemaFactory.createForClass(Film);
