import { UtilityModule } from '@common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Post,
  PostController,
  PostEditRequest,
  PostEditRequestService,
  PostReport,
  PostReportService,
  PostService,
} from '@post';
import { UsersModule } from '@user';

@Module({
  imports: [
    UtilityModule,
    UsersModule,
    TypeOrmModule.forFeature([Post, PostEditRequest, PostReport]),
  ],
  controllers: [PostController],
  providers: [PostService, PostReportService, PostEditRequestService],
})
export class PostModule {}
