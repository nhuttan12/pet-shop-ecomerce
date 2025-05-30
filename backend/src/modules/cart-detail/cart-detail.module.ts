import { Module } from '@nestjs/common';
import { CartDetailController } from './cart-detail.controller';
import { CartDetailService } from './cart-detail.service';
import { UtilityModule } from 'src/helper/services/utility.module';

@Module({
  imports: [UtilityModule],
  controllers: [CartDetailController],
  providers: [CartDetailService],
})
export class CartDetailModule {}
