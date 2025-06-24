import { PaginationMeta } from '@dtos/response/pagination/pagination-meta';

export class PaginationResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
