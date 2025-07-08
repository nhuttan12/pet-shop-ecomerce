import { AppConfigModule } from '@config/app-config.module';
import { MailService } from './mail.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [AppConfigModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
