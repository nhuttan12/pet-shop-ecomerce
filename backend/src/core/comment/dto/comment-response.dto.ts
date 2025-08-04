import { Expose, Type } from 'class-transformer';
import { AutoMap } from '@automapper/classes';

export class CommentResponseDto {
  @Expose()
  @AutoMap()
  id: number;

  @Expose()
  @AutoMap()
  content: string;

  @Expose()
  @AutoMap()
  authorID: number;

  @Expose()
  @AutoMap()
  authorName: string;

  @Expose()
  @AutoMap()
  createdAt: Date;

  @Expose()
  @AutoMap()
  parentID: number | null;

  @Expose()
  @AutoMap(() => [CommentResponseDto])
  @Type(() => CommentResponseDto)
  replies: CommentResponseDto[];
}
