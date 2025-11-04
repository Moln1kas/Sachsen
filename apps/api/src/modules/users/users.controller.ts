import { Controller, Get, NotFoundException, Param, Req, UseGuards} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-access.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() reqUser: { sub: number }) {
    const user = await this.usersService.findById(reqUser.sub);

    if(!user) throw new NotFoundException('Ваш профиль не найден в базе данных.');

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      status: user.status,
    }
  }

  @Get(':username')
  @UseGuards(JwtAuthGuard)
  async findByUsername(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);

    if(!user) throw new NotFoundException('Пользователь не найден в базе данных.');

    return {
      id: user.id,
      username: user.username,
      role: user.role,
      status: user.status,
    }
  }

  @Get(':id/status')
  @UseGuards(JwtAuthGuard)
  async getUserStatus(@Param('id') id: number) {
    const userStatus = await this.usersService.getUserStatus(id);
    return !!userStatus;
  }
}
