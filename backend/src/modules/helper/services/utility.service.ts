import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilityService {
  getPagination(page = 1, limit = 10) {
    return {
      skip: (page - 1) * limit,
      take: limit,
    };
  }
}
