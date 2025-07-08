import { Module, Post } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEditRequest } from '@post/entities/post-edit-request.entity';
import { PostReport } from '@post/entities/post-report.entity';
import { PostEditRequestService } from '@post/post-edit-request.service';
import { PostReportService } from '@post/post-report.service';
import { PostController } from '@post/post.controller';
import { PostService } from '@post/post.service';
import { UtilityModule } from '@services/utility.module';
import { UsersModule } from '@user/user.module';

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
