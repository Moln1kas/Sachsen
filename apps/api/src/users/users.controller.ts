import { Controller, Get, Req, UseGuards} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-access.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { StatusGuard } from 'src/common/guards/status.guard';
import { Status } from 'src/common/decorators/status.decorator';
import { Role } from 'src/common/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard, StatusGuard)
  @Status('APPROVED')
  async getProfile(@CurrentUser() reqUser: { sub: number }) {
    const user = await this.usersService.findById(reqUser.sub);

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      status: user.status,
    }
  }
}
