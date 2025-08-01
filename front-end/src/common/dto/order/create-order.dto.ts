export interface CreateOrderDto {
  amount: number;
  currency: string;
  return_url: string;
  cancel_url: string;
  description?: string;
}
