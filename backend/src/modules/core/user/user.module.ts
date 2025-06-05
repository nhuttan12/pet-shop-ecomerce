import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RoleModule } from '../role/role.module';
import { UtilityModule } from 'src/modules/helper/services/utility.module';
import { ImageModule } from 'src/modules/helper/image/image.module';

@Module({
  imports: [ImageModule, RoleModule, UtilityModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
