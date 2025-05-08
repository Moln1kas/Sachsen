import { Body, Controller, Get, HttpStatus, Post, Query, Req } from '@nestjs/common';
import { EmailConfirmService } from './email-confirm.service';
import { EmailConfirmDto } from './dto/confirm.dto';

@Controller({
  path: 'auth/email-confirm',
  version: '1',
})
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
