import { Body, Controller, Post, Req, UseGuards, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, SignUpResponseDto } from './dto/sign-up.dto';
import { SignInDto, SignInResponseDto } from './dto/sign-in.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtAuthGuard } from './guards/jwt-access.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @Throttle({ default: { limit: 1, ttl: 5000 } })
  async signUp(@Body() signUpDto: SignUpDto): Promise<SignUpResponseDto> {
    return this.authService.signUp(signUpDto);
  }

  @Post('sign-in')
  @Throttle({ default: { limit: 3, ttl: 120000 } })
  async signIn(@Body() signInDto: SignInDto): Promise<SignInResponseDto> {
    return this.authService.signIn(signInDto);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  refresh(@Req() req) {
    const user = req.user;
    const refreshToken = req.headers['authorization']?.split(' ')[1];
    return this.authService.refreshTokens(user.sub, refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtRefreshGuard)
  logout(@Req() req) {
    const user = req.user;
    return this.authService.logout(user.sub);
  }

  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 1, ttl: 60000 } })
  deleteAccount(@Req() req) {
    const user = req.user;
    return this.authService.deleteAccount(user.sub);
  }
}
