/**
 * @description: jwt payload after sign token, it's use for authorization
 * @var sub: sub number of payload
 * @var username: username of user's token signed
 * @var role: role of user's token signed
 * @var email: role of user's token signed
 * @var iat: if the token has issue, it will write to here, and the system checking it
 * @var exp: time for token to live in amount of time, in usual it's about 15m, 30, 60m
 */
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
