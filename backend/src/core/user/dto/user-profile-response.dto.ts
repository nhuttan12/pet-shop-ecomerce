import { AutoMap } from '@automapper/classes';

export class UserProfileResponseDTO {
  @AutoMap()
  id: number;

  @AutoMap()
  name: string;

  @AutoMap()
  email: string;

  @AutoMap()
  avatar: string;

  @AutoMap()
  phone: string;

  @AutoMap()
  gender: string;

  @AutoMap()
  birthDate: Date;
}
