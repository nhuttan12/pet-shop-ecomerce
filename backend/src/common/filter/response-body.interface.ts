export interface ResponseBody {
  statusCode: number;
  timestamp: string;
  path: string;
  message?: string;
  detail?: string;
  error?: string;
  [key: string]: any;
}
