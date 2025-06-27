import { JwtPayload } from '@auth';
import { User } from '@user';

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

export interface RequestWithUser extends Request {
  user: User;
}
