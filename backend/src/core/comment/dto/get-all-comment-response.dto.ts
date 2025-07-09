import { Expose } from 'class-transformer';

export class GetCommentResponseDto {
  @Expose()
  id: number;

  @Expose()
  content: string;

  @Expose()
  authorId: number;

  @Expose()
  authorName: string;

  @Expose()
  createdAt: Date;

  @Expose()
  parentId: number | null;

  @Expose()
  replies: GetCommentResponseDto[];
}
