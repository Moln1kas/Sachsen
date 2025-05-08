import { MailerOptions } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";

export const getMailerConfig = async(
  configService: ConfigService
): Promise<MailerOptions> => ({
  transport: {
    host: configService.getOrThrow<string>('MAIL_HOST'),
    port: configService.getOrThrow<number>('MAIL_PORT'),
    auth: {
      user: configService.getOrThrow<string>('MAIL_USER'),
      pass: configService.getOrThrow<string>('MAIL_PASSWORD'), 
    }
  },
  defaults: {
    from: 'MOLNIKAS.SU',
  }
});