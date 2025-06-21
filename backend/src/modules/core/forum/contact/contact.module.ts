import { ContactController } from '@core-modules/forum/contact/contact.controller';
import { ContactService } from '@core-modules/forum/contact/contact.service';
import { UtilityModule } from '@helper-modules/services/utility.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [UtilityModule],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
