import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { UtilityModule } from 'src/helper/services/utility.module';

@Module({
  imports: [UtilityModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
