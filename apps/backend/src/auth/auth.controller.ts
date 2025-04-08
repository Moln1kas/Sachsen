import { Body, Controller, Get, Post, UseGuards, Request, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, LoginResponseDto, RegisterResponseDto } from './dto/auth.dto';
import { JwtAuthGuard } from './auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() dto: RegisterDto): Promise<RegisterResponseDto> {
    return this.authService.register(dto);
  }

  @Post('/login')
  async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMINISTRATOR')
  @Post('/approve/:id')
  async approveRegistration(@Param('id', ParseIntPipe) id: number) {
    return this.authService.approveRegistration(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMINISTRATOR')
  @Post('/reject/:id')
  async rejectRegistration(@Param('id', ParseIntPipe) id: number) {
    return this.authService.rejectRegistration(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteAccount(@Request() req) {
    return this.authService.deleteAccount(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getProfile(@Request() req) {
    return {
      id: req.user.userId,
      username: req.user.username,
      roles: req.user.roles,
    };
  }
}