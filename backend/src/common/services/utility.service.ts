import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilityService {
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
}
