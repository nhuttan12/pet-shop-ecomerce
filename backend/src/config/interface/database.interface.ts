/**
 * @description: configuration info of database config
 * in file yaml is written in interface for intellisense
 * @var mysql: config info for mysql db
 * @var host: host name of mysql, example: localhost, 192.168.0.0.1
 * @var port: port number of mysql, example: 3306,...
 * @var database: port name of db, example: tmdt-ck
 * @var dialect: type of db, example: mysql, postgres,...
 * @var username: username to access db
 * @var password: password to access db
 */
export interface DatabaseConfig {
  mysql: {
    host: string;
    port: number;
    database: string;
    dialect: string;
    username: string;
    password: string;
  };
}
