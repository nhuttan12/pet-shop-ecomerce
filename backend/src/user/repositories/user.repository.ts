import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetAllUsersResponseDTO } from '@user';
import { Repository } from 'typeorm';
import { User } from 'user/entites';
import { UserStatus } from 'user/enums';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async getUserById(id: number): Promise<User | null> {
    return await this.userRepo.findOne({ where: { id } });
  }

  async getUserByName(name: string): Promise<User | null> {
    return await this.userRepo.findOne({ where: { name } });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findOne({ where: { email } });
  }

  async getUserByUserName(username: string): Promise<User | null> {
    return await this.userRepo.findOne({ where: { username } });
  }

  async findUsers(
    filters: Partial<{
      name?: string;
      username?: string;
      email?: string;
      status?: UserStatus;
    }>,
    take?: number,
    skip?: number,
    sortField: keyof User = 'id',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<User[]> {
    return await this.userRepo.find({
      where: filters,
      take,
      skip,
      order: { [sortField]: sortOrder },
    });
  }

  async findUserForAdmin(
    filters: Partial<{
      name?: string;
      username?: string;
      email?: string;
      status?: UserStatus;
    }>,
    take?: number,
    skip?: number,
    sortField: keyof User = 'id',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<GetAllUsersResponseDTO[]> {
    return await this.userRepo.find({
      relations: {
        userDetail: true,
      },
      where: {
        subjectId: 
      },
    });
  }
}
