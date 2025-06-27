import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, RoleRepository } from '@role';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: RoleRepository,
  ) {}

  /**
   * @description: get role information with the
   *  id from database, if not found, throw error
   * @param id: id of role to found
   * @returns: role
   */
  async getRoleById(id: number): Promise<Role> {
    return await this.roleRepo.getRoleById(id);
  }

  /**
   * @description: get role by name from the database,
   *  if found return the role, if not found, throw error with code 401
   * @param name: name of the role for founding
   * @returns: role
   */
  async getRoleByName(name: string): Promise<Role> {
    return await this.getRoleByName(name);
  }
}
