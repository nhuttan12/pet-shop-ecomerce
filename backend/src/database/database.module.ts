import { Module } from '@nestjs/common';
import { DrizzleAsyncProvider, drizzleProvider } from './drizzle.provider';

@Module({
  exports: [DrizzleAsyncProvider],
  providers: [...drizzleProvider],
})
export class DatabaseModule {}
