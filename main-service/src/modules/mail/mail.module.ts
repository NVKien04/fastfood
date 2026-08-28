import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from '@/modules/mail/application/services/mail.service';
import { NodemailerMailService } from '@/modules/mail/infrastructure/nodemailer-mail.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    NodemailerMailService,
    {
      provide: 'IMailProvider',
      useExisting: NodemailerMailService,
    },
    MailService,
    {
      provide: 'IMailService',
      useExisting: MailService,
    },
  ],
  exports: [MailService, NodemailerMailService, 'IMailService', 'IMailProvider'],
})
export class MailModule {}
