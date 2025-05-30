import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { SearchModule } from 'src/helper/services/utility.module';

@Module({
  imports: [SearchModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
