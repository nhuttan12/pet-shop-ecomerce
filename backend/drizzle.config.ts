import { defineConfig } from 'drizzle-kit';
import configuration from 'src/config/configuration';

const config = configuration();

export default defineConfig({
  dialect: 'mysql',
  schema: './src/db/schema/*',
  out: './drizzle',
  dbCredentials: {
    host: config.db.mysql.host,
    port: config.db.mysql.port,
    user: config.db.mysql.username,
    password: config.db.mysql.password,
    database: config.db.mysql.database,
  },
});
