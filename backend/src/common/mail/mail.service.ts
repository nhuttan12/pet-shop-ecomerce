import { AppConfigService } from '@config/app-config.service';
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  constructor(private readonly appConfigService: AppConfigService) {}
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: this.appConfigService.email,
      pass: this.appConfigService.appPassword,
    },
  });

  async sendMail(
    to: string,
    subject: string,
    htmlContent: string,
  ): Promise<SMTPTransport.SentMessageInfo> {
    const info: SMTPTransport.SentMessageInfo = await this.transporter.sendMail(
      {
        from: this.appConfigService.email,
        to,
        subject,
        html: htmlContent,
      },
    );

    this.logger.debug('Info to send email', info);
    return info;
  }
}
