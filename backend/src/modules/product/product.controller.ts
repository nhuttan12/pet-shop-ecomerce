import { Controller, Logger } from '@nestjs/common';

@Controller('product')
export class ProductController {
  private readonly logger = new Logger();
}
