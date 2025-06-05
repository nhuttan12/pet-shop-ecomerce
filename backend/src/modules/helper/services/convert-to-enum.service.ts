import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ConvertToEnum {
  private readonly logger = new Logger();

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
