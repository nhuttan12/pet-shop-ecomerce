import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { UtilityModule } from 'src/modules/helper/services/utility.module';

@Module({
  imports: [UtilityModule],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
