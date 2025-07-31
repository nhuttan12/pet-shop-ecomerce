import { Expose } from 'class-transformer';
import { AutoMap } from '@automapper/classes';

export class PostResponse {
  @Expose()
  @AutoMap()
  id: number;

  @Expose()
  @AutoMap()
  title: string;

  @Expose()
  @AutoMap()
  content: string;

  @Expose()
  @AutoMap()
  authorId: number;

  @Expose()
  @AutoMap()
  authorName: string;

  @Expose()
  @AutoMap()
  status: string;

  @Expose()
  @AutoMap()
  hasPendingEditRequest: boolean;

  @Expose()
  @AutoMap()
  createdAt: Date;

  @Expose()
  @AutoMap()
  updatedAt: Date;
}
