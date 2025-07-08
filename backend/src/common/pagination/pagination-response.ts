import { PaginationMeta } from '@pagination/pagination-meta';

export class PaginationResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
