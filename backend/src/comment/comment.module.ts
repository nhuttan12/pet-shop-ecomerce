import { CommentController, CommentService } from '@comment';
import { UtilityModule } from '@common';
import { Module } from '@nestjs/common';

@Module({
  imports: [UtilityModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
