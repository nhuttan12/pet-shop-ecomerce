import { ImageModule } from '@images/image.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from '@role/role.module';
import { UtilityModule } from '@services/utility.module';
import { User } from '@user/entites/users.entity';
import { UserController } from '@user/user.controller';
import { UserService } from '@user/user.service';
import { UserRepository } from 'user/repositories/user.repository';

@Module({
  imports: [
    ImageModule,
    RoleModule,
    UtilityModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UsersModule {}
