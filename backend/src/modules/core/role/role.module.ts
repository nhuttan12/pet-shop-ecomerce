import { RoleService } from '@core-modules/role/role.service';
import { UtilityModule } from '@helper-modules/services/utility.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [UtilityModule],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
