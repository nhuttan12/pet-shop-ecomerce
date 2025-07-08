import { CommentController } from '@comment/comment.controller';
import { CommentService } from '@comment/comment.service';
import { Module } from '@nestjs/common';
import { UtilityModule } from '@services/utility.module';

@Module({
  imports: [UtilityModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
