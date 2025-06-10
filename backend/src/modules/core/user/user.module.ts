import { RoleModule } from '@core-modules/role/role.module';
import { UserController } from '@core-modules/user/user.controller';
import { UserService } from '@core-modules/user/user.service';
import { ImageModule } from '@helper-modules/image/image.module';
import { UtilityModule } from '@helper-modules/services/utility.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [ImageModule, RoleModule, UtilityModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
