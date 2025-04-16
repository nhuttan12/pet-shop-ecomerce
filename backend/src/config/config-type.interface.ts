export interface ValidationType {
  http: {
    host: string;
    port: number;
  };
  db: {
    postgres: {
      url: string;
      port: number;
      database: string;
    };
  };
}
