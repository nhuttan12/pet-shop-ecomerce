import { Expose } from 'class-transformer';

export class GetCategoryByIdResponse {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  status: string;

  @Expose()
  imageUrl: string;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
