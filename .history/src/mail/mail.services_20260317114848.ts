import { Injectable,Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from 'nodemailer';

@Injectable()

export class MailService {
    private transporter: nodemailer.Transpoter;
    private readonly logger = new Logger(MailService.name)
    
}