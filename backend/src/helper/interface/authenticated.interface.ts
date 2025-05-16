import { User } from 'src/db/helper/schema-type';
import { JwtPayload } from './jwt-payload.interface';

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

export interface RequestWithUser extends Request {
  user: User;
}
