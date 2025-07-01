import { Expose } from 'class-transformer';

export class PostResponse {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  authorId: number;

  @Expose()
  authorName: string;

  @Expose()
  status: string;

  @Expose()
  hasPendingEditRequest: boolean;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
