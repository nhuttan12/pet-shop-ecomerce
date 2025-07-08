import { Module } from '@nestjs/common';
import { UtilityModule } from '@services/utility.module';
import { RoleService } from '@role/role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '@role/entities/roles.entity';

@Module({
  imports: [UtilityModule, TypeOrmModule.forFeature([Role])],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
