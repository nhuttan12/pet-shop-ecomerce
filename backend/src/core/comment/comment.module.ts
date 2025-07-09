import { CommentController } from '@comment/comment.controller';
import { CommentService } from '@comment/comment.service';
import { Comment } from '@comment/entities/comments.entity';
import { CommentRepository } from '@comment/repositories/comment.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilityModule } from '@services/utility.module';

@Module({
  imports: [UtilityModule, TypeOrmModule.forFeature([Comment])],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository],
})
export class CommentModule {}
