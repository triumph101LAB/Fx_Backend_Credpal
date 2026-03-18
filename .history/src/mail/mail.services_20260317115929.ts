import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: +this.configService.get('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASS'),
      },
    });
  }

  async sendOtp(email: string, otp: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"FX Trading App" <${this.configService.get('MAIL_USER')}>`,
        to: email,
        subject: 'Your Email Verification OTP',
        html: `
          <div style="font-family:sans-serif;max-width:400px;margin:auto;padding:24px;border:1px solid #eee;border-radius:8px">
            <h2 style="margin-top:0">Email Verification</h2>
            <p>Your OTP code is:</p>
            <div style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#333;margin:16px 0">${otp}</div>
            <p style="color:#666">This code expires in <strong>10 minutes</strong>.</p>
            <p style="color:#999;font-size:12px">If you did not request this, ignore this email.</p>
          </div>
        `,
      });
      this.logger.log(`OTP sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send OTP to ${email}`, error);
      throw error;
    }
  }
}
