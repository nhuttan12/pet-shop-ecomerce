import { UtilityModule } from '@common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Post,
  PostController,
  PostEditRequest,
  PostReport,
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
  providers: [PostService],
})
export class PostModule {}
