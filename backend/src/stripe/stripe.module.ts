import { DynamicModule, Module } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { AppConfigService } from 'src/modules/config/app-config.service';
import { AppConfigModule } from 'src/modules/config/app-config.module';
import { STRIPE_API_KEY } from 'src/helper/constants';

@Module({})
export class StripeModule {
  static forRootAsync(): DynamicModule {
    return {
      module: StripeModule,
      imports: [AppConfigModule],
      controllers: [StripeController],
      providers: [
        StripeService,
        {
          provide: STRIPE_API_KEY,
          useFactory: (appConfigService: AppConfigService) =>
            appConfigService.getStripeConfig.public_key,
          inject: [AppConfigService],
        },
      ],
      exports: [StripeService, STRIPE_API_KEY],
    };
  }
}
