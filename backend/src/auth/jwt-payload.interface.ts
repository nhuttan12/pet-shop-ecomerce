export interface JwtPayload {
  sub: string;
  username: string;
  role: string;
  expire: number;
  email?: string;
  issue?: number;
}
