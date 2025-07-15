import { PaginationMeta } from './pagination-meta';

export interface PaginationResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
