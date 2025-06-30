import { PaginationMeta } from '@common';

export class PaginationResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
