import { JwtPayload } from '@auth/interfaces/jwt-payload.interface';
import { User } from '@user/entites/users.entity';

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

export interface RequestWithUser extends Request {
  user: User;
}
