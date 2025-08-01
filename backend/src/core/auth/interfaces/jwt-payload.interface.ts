export interface JwtPayload {
  sub: number;
  role: string;
  email?: string;
}
