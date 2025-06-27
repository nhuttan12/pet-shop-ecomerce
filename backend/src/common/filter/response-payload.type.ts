export type ResponsePayload = {
  message?: string;
  detail?: string;
  error?: string;
  [key: string]: any; // Nếu còn các trường khác
};
