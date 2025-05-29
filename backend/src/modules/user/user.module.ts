import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ImageModule } from '../image/image.module';
import { RoleModule } from '../role/role.module';
import { SearchModule } from 'src/helper/services/search.module';

@Module({
  imports: [ImageModule, RoleModule, SearchModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
