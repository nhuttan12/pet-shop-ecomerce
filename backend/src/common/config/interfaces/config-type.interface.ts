import { DatabaseConfig, DomainValidation, HttpConfig } from '@common';

/**
 * @description: configuration info get form file yaml
 * @var http: contain http config info, involve in host, port, jwtKey, expireTime, ...
 * @var db: contain database config info, invole in port, dialect, host, username, password to access the db
 */
export interface ValidationType {
  http: HttpConfig;
  db: DatabaseConfig;
  domain: DomainValidation;
}
