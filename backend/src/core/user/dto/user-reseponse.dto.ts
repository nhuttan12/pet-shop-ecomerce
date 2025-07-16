import { AutoMap } from '@automapper/classes';

export class UserResponseDTO {
  @AutoMap()
  id: number;

  @AutoMap()
  username: string;

  @AutoMap()
  password: string;

  @AutoMap()
  name: string;

  @AutoMap()
  email: string;

  @AutoMap()
  roleName: string;

  @AutoMap()
  avatar: string;

  @AutoMap()
  status: string;

  @AutoMap()
  createdAt: Date;

  @AutoMap()
  updatedAt: Date;
}
