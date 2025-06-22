import { CommentController } from '@core-modules/forum/comment/comment.controller';
import { CommentService } from '@core-modules/forum/comment/comment.service';
import { UtilityModule } from '@helper-modules/services/utility.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [UtilityModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
