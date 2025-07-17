import { Injectable } from '@nestjs/common';
import { PrettyLoggerService } from '@services/pretty-logger.service';

@Injectable()
export class UtilityService {
  constructor(private readonly logger: PrettyLoggerService) {}
  getPagination(page = 1, limit = 10) {
    return {
      skip: (page - 1) * limit,
      take: limit,
    };
  }

  toEnumValue<T extends { [key: string]: string }>(
    enumObject: T,
    value: string,
  ): T[keyof T] {
    if (Object.values(enumObject).includes(value as T[keyof T])) {
      return value as T[keyof T];
    }
    throw new Error(`Invalid enum value: ${value}`);
  }

  logPretty(label: string, data: any) {
    try {
      const formatted = JSON.stringify(data, null, 2);
      this.logger.debug(`${label}:\n${formatted}`);
    } catch (error) {
      this.logger.error('Pretty log failed', (error as Error).stack);
      throw error;
    }
  }
}
