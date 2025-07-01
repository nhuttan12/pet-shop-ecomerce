import { Injectable, Logger } from '@nestjs/common';
import { PostReport } from '@post';
import { Repository } from 'typeorm';

@Injectable()
export class PostReportRepository {
  private readonly logger = new Logger(PostReportRepository.name);
  constructor(private readonly postReportRepo: Repository<PostReport>) {}
}
