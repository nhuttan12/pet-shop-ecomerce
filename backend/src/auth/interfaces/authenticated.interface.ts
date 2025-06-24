import { JwtPayload } from '@interfaces';
import { User } from '@schema-type';

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

export interface RequestWithUser extends Request {
  user: User;
}
