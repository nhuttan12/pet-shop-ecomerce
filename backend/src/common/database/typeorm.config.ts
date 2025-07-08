import { AppConfigService } from '@config/app-config.service';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

type Dialect =
  | 'mysql'
  | 'mariadb'
  | 'postgres'
  | 'sqlite'
  | 'mssql'
  | 'oracle'
  | 'mongodb';

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  imports: [AppConfigService],
  useFactory: (configService: AppConfigService) => ({
    type: configService.getDatabaseConfig.mysql.dialect as Dialect,
    host: configService.getDatabaseConfig.mysql.host,
    port: configService.getDatabaseConfig.mysql.port,
    username: configService.getDatabaseConfig.mysql.username,
    password: configService.getDatabaseConfig.mysql.password,
    database: configService.getDatabaseConfig.mysql.database,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'], // hoặc đường dẫn entity cụ thể
    synchronize: true,
    autoLoadEntities: true,
  }),
  inject: [AppConfigService],
};
