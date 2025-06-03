import { Module } from '@nestjs/common';
import { PaypalController } from './paypal.controller';
import { PaypalService } from './paypal.service';
import { AppConfigModule } from 'src/modules/config/app-config.module';

@Module({
  imports: [AppConfigModule],
  controllers: [PaypalController],
  providers: [PaypalService],
})
export class PaypalModule {}
