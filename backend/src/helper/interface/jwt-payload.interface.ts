/**
 * @description: jwt payload after sign token, it's use for authorization
 * @var sub: sub number of payload
 * @var username: username of user's token signed
 * @var role: role of user's token signed
 * @var email: role of user's token signed
 */
export interface JwtPayload {
  sub: number;
  username: string;
  role: string;
  email?: string;
}
