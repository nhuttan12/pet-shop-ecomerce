import { CommentController } from '@core-modules/forum/comment/comment.controller';
import { CommentService } from '@core-modules/forum/comment/comment.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
