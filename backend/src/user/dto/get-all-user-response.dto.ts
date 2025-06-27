import { Image } from '@common';
import { User, UserDetail, UserStatus } from '@user';
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
    return userDetail.adresss ?? '';
  })
  adresss: string;

  @Expose()
  @Transform(({ obj }) => {
    const image = obj as Image;
    return image.url ?? '';
  })
  image: string;
}
