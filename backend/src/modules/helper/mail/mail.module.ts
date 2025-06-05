import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { AppConfigModule } from '../config/app-config.module';
// import { MailController } from './mail.controller';

@Module({
  imports: [AppConfigModule],
  providers: [MailService],
  exports: [MailService],
  // controllers: [MailController],
})
export class MailModule {}
