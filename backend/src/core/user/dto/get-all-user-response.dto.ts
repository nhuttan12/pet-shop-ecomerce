import { Image } from '@images/entites/images.entity';
import { UserDetail } from '@user/entites/user-details.entity';
import { User } from '@user/entites/users.entity';
import { UserStatus } from '@user/enums/user-status.enum';
import { Expose, Transform } from 'class-transformer';

export class GetAllUsersResponseDTO {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  password: string;

  @Expose()
  name: string;

  @Expose()
  @Transform(({ obj }) => {
    const user = obj as User;
    return user.role?.name ?? '';
  })
  email: string;

  @Expose()
  role: string;

  @Expose()
  status: UserStatus;

  @Expose()
  @Transform(({ obj }) => {
    const userDetail = obj as UserDetail;
    return userDetail.phone ?? '';
  })
  phone: string;

  @Expose()
  @Transform(({ obj }) => {
    const userDetail = obj as UserDetail;
    return userDetail.adress ?? '';
  })
  adresss: string;

  @Expose()
  @Transform(({ obj }) => {
    const image = obj as Image;
    return image.url ?? '';
  })
  image: string;
}
