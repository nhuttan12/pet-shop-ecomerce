import { Global, Module } from '@nestjs/common';
import { DrizzleAsyncProvider, drizzleProvider } from './drizzle.provider';

@Global()
@Module({
  exports: [DrizzleAsyncProvider],
  providers: [...drizzleProvider],
})
export class DatabaseModule {}
