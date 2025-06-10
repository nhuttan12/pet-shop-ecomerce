import {
  DrizzleAsyncProvider,
  drizzleProvider,
} from '@helper-modules/database/drizzle.provider';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  exports: [DrizzleAsyncProvider],
  providers: [...drizzleProvider],
})
export class DatabaseModule {}
