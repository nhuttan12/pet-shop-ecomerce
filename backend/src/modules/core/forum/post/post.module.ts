import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { UtilityModule } from 'src/modules/helper/services/utility.module';

@Module({
  imports: [UtilityModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
