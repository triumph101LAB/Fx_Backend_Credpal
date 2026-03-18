import { Module } from "@nestjs/common";
import { MailService } from "./mail.services";

@Module({
    imports:[],
    providers:[MailService],
    exports:[M]
})
export class MailModule{}