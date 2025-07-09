export interface PayPalHttpResponse<T = any> {
  statusCode: number;
  headers: Record<string, string | string[] | undefined>;
  result?: T;
}
