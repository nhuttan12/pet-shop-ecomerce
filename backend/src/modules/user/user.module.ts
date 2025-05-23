import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ImageModule } from '../image/image.module';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [ImageModule, RoleModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
