import { ConfigService } from '@nestjs/config';
import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import configuration from 'src/config/configuration';

/**
 * @description: providing connection pool to the database
 * @var DrizzleAsyncProvider: driver to connect for service file
 * @var drizzleProvider: config file to connect to the database
 * @var config: loading config infro from configuration.ts file
 * @var poolConnection: providing connection pool to the database
 *  with host, port, user, password, database variable load from config file
 * @returns: return the drizzle connection pool
 */
export const DrizzleAsyncProvider = 'DrizzleAsyncProvider';
export const drizzleProvider = [
  {
    provide: DrizzleAsyncProvider,
    inject: [ConfigService],
    useFactory: () => {
      const config = configuration();

      const poolConnection = mysql.createPool({
        host: config.db.mysql.host,
        port: config.db.mysql.port,
        user: config.db.mysql.username,
        password: config.db.mysql.password,
        database: config.db.mysql.database,
      });

      return drizzle({ client: poolConnection });
    },
  },
];
