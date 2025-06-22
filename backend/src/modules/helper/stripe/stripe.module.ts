import { DynamicModule, Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { STRIPE_API_KEY } from '@constants';
import { AppConfigModule } from '@helper-modules/config/app-config.module';
import { AppConfigService } from '@helper-modules/config/app-config.service';

@Module({})
export class StripeModule {
  static forRootAsync(): DynamicModule {
    return {
      module: StripeModule,
      imports: [AppConfigModule],
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
