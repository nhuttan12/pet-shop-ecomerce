import { UtilityModule } from '@common';
import { Module } from '@nestjs/common';
import { RoleService } from '@role';

@Module({
  imports: [UtilityModule],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
