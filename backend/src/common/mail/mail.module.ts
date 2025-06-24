import { AppConfigModule } from '@helper-modules/config/app-config.module';
import { MailService } from '@helper-modules/mail/mail.service';
import { Module } from '@nestjs/common';
// import { MailController } from './mail.controller';

@Module({
  imports: [AppConfigModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
