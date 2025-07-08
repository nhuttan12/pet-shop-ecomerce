import { UtilityModule } from "@services/utility.module";
import Module from "module";
import { RoleService } from "./role.service";

@Module({
  imports: [UtilityModule],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}


