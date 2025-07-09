import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Role } from '@role/entities/roles.entity';
import { RoleMessageLog } from '@role/messages/role.mesages-log';
import { RoleErrorMessages } from '@role/messages/role.error-messages';
import { InjectRepository } from '@nestjs/typeorm';

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
