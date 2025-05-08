import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';
import { ConfirmTemplate } from './templates/confirm.template';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService
  ) {}

  public async sendConfirmationEmail(to: string, token: string) {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
    const address = `${domain}/auth/email-confirm?token=${token}`;
    const html = await render(ConfirmTemplate({ address }))

    return this.sendMail(to, 'Подтверждение почты', html);
  }

  private sendMail(to: string, subject: string, html: string) {
    return this.mailerService.sendMail({ to, subject, html });
  }
}
