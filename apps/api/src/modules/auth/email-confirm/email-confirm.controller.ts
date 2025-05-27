import { Body, Controller, Get, HttpStatus, Post, Query, Req } from '@nestjs/common';
import { EmailConfirmService } from './email-confirm.service';
import { EmailConfirmDto } from './dto/confirm.dto';

@Controller('auth/email-confirm')
export class EmailConfirmController {
  constructor(private readonly emailConfirmService: EmailConfirmService) {}

  @Get()
  public async newVerification(
    @Req() req: Request, 
    @Query('token') token: string,
  ) {
    return this.emailConfirmService.newVerification(req, token);
  }
}
