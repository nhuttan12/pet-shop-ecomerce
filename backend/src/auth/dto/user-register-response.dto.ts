import { Expose } from 'class-transformer';

export class UserRegisterResponseDTO {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  role: string;

  @Expose()
  status: string;
}
