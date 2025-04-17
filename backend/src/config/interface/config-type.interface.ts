export interface ValidationType {
  http: {
    host: string;
    port: number;
    jwtKey: string;
    expireTime: number | string;
  };
  db: {
    mysql: {
      host: string;
      port: number;
      database: string;
      dialect: string;
      username: string;
      password: string;
    };
  };
}
