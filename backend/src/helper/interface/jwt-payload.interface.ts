export interface JwtPayload {
  sub: number;
  username: string;
  role: string;
  email?: string;
  iat?: number; //issued at
  exp?: number; //expiration time
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
