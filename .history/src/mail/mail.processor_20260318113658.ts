import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { MailService } from './mail.service';
import { Logger } from '@nestjs/common';

@Processor('mail')
export class MailProcessor {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(private readonly mailService: MailService) {}

  @Process('send-otp')
  async handleSendOtp(job: Job<{ email: string; otp: string }>) {
    this.logger.log(`Processing OTP email for ${job.data.email}`);
    await this.mailService.sendOtp(job.data.email, job.data.otp);
    this.logger.log(`OTP email sent to ${job.data.email}`);
  }
}