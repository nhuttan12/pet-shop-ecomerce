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
