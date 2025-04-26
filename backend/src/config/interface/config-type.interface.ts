import { DatabaseConfig } from './database.interface';
import { HttpConfig } from './http.interface';
export interface ValidationType {
  http: HttpConfig;
  db: DatabaseConfig;
}
