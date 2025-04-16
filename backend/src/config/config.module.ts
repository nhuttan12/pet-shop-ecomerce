import { Module } from '@nestjs/common';
import {
  DrizzleAsyncProvider,
  drizzleProvider,
} from './drizzle/drizzle.provider';

@Module({
  exports: [DrizzleAsyncProvider],
  providers: [...drizzleProvider],
})
export class ConfigModule {}
