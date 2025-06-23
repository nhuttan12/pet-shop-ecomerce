import { DynamicModule, Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { AppConfigModule } from '@helper-modules/config/app-config.module';
import { AppConfigService } from '@helper-modules/config/app-config.service';
import { StripeController } from '@helper-modules/stripe/stripe.controller';
import { STRIPE_API_KEY } from '@constants';

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
            appConfigService.getStripeConfig.secret_key,
          inject: [AppConfigService],
        },
      ],
      controllers: [StripeController],
      exports: [StripeService, STRIPE_API_KEY],
    };
  }
}
