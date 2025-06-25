import { ImageModule, UtilityModule } from '@common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from '@role';
import { User, UserController, UserService } from '@user';

@Module({
  imports: [
    ImageModule,
    RoleModule,
    UtilityModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
