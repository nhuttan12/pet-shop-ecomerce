import { Role } from "@role/entities/roles.entity";
import { RoleErrorMessages } from "@role/messages/role.error-messages";
import { RoleMessageLog } from "@role/messages/role.mesages-log";

@Injectable()
export class RoleRepository {
  private readonly logger = new Logger(RoleRepository.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    private readonly dataSource: DataSource,
  ) {}

  async getRoleById(id: number): Promise<Role> {
    const role = await this.roleRepo.findOneBy({ id });

    if (!role) {
      this.logger.error(RoleMessageLog.ROLE_NOT_FOUND);
      throw new NotFoundException(RoleErrorMessages.ROLE_NOT_FOUND);
    }

    return role;
  }

  async getRoleByName(name: string): Promise<Role> {
    const role = await this.roleRepo.findOneBy({ name });

    if (!role) {
      this.logger.error(RoleMessageLog.ROLE_NOT_FOUND);
      throw new NotFoundException(RoleErrorMessages.ROLE_NOT_FOUND);
    }

    return role;
  }
}


