import { Injectable, Logger } from '@nestjs/common';
import { RoleRepository } from '@role/repositories/role.repository';
import { Role } from '@role/entities/roles.entity';
import { UtilityService } from '@services/utility.service';

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);
  constructor(
    private readonly utilityService: UtilityService,
    private readonly roleRepo: RoleRepository,
  ) {}

  /**
   * @description: get role information with the
   *  id from database, if not found, throw error
   * @param id: id of role to found
   * @returns: role
   */
  async getRoleById(id: number): Promise<Role> {
    const role: Role = await this.roleRepo.getRoleById(id);
    this.utilityService.logPretty('Role: ', role);

    return role;
  }

  /**
   * @description: get role by name from the database,
   *  if found return the role, if not found, throw error with code 401
   * @param name: name of the role for founding
   * @returns: role
   */
  async getRoleByName(name: string): Promise<Role> {
    const role: Role = await this.roleRepo.getRoleByName(name);
    this.utilityService.logPretty('Role: ', role);

    return role;
  }
}
