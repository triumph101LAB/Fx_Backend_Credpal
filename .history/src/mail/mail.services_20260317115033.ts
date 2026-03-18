import { Injectable,Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from 'nodemailer';

@Injectable()

export class MailService {
    private transporter: nodemailer.Transpoter;
    private readonly logger = new Logger(MailService.name)

    constructor (private configService:ConfigService){
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('MAIL_HOST'),
            port:+ this.configService.get('MAIL_PORT'),
            secure:false,

            auth:{
                user:this.configService.get(MAIL_)
            }
        })
    }
}