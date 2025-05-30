import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { SearchModule } from 'src/helper/services/utility.module';

@Module({
  imports: [SearchModule],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
