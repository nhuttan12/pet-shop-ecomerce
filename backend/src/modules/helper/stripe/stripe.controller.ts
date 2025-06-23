import { StripeService } from '@helper-modules/stripe/stripe.service';
import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Stripe')
@Controller('api/v1/stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('im2port-products')
  @ApiOperation({ summary: 'Import sản phẩm từ DB lên Stripe' })
  async importProductsToStripe(): Promise<{ count: number }> {
    return this.stripeService.importProductsFromDb();
  }
}
