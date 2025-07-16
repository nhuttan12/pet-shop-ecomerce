import { ImageModule } from '@images/image.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from '@role/role.module';
import { UtilityModule } from '@services/utility.module';
import { User } from '@user/entites/users.entity';
import { UserController } from '@user/user.controller';
import { UserService } from '@user/user.service';
import { UserRepository } from '@user/repositories/user.repository';
import { UserDetail } from '@user/entites/user-details.entity';
import { MapperModule } from 'common/mapper/mapper.module';

@Module({
  imports: [
    MapperModule,
    ImageModule,
    RoleModule,
    UtilityModule,
    TypeOrmModule.forFeature([User, UserDetail]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UsersModule {}
