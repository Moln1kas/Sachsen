import { Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-access.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Throttle } from '@nestjs/throttler';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminUsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @Role('ADMIN', 'OWNER')
  async findAll(
    @Query('page', ParseIntPipe) pageQuery: number = 1,
    @Query('limit', ParseIntPipe) limitQuery: number = 10,
  ) {
    const page = Math.max(pageQuery || 1, 1);
    const limit = Math.min(Math.max(limitQuery, 1), 100);

    const skip = (page - 1) * limit;
    const users = await this.usersService.findMany({ skip, take: limit });
    const total = await this.usersService.count();

    return { total, page, limit, users };
  }

  // Контроллеры заявок
  @Post(':id/approve')
  @Role('ADMIN', 'OWNER')
  @Throttle({ default: { limit: 5, ttl: 120000 } })
  async approveUser(
    @Param('id', ParseIntPipe) userId: number,
    @CurrentUser() reqUser: { sub: number },
  ) {
    return await this.usersService.approveUser(reqUser.sub, userId);
  }

  @Post(':id/reject')
  @Role('ADMIN', 'OWNER')
  @Throttle({ default: { limit: 5, ttl: 120000 } })
  async rejectUser(
    @Param('id', ParseIntPipe) userId: number,
    @CurrentUser() reqUser: { sub: number },
  ) {
    return await this.usersService.rejectUser(reqUser.sub, userId);
  }

  // Бан контроллеры
  @Post(':id/ban')
  @Role('ADMIN', 'OWNER')
  @Throttle({ default: { limit: 3, ttl: 120000 } })
  async banUser(
    @Param('id', ParseIntPipe) userId: number,
    @CurrentUser() reqUser: { sub: number },
  ) {
    return await this.usersService.banUser(reqUser.sub, userId);
  }

  @Post(':id/unban')
  @Role('ADMIN', 'OWNER')
  @Throttle({ default: { limit: 3, ttl: 120000 } })
  async unbanUser(
    @Param('id', ParseIntPipe) userId: number,
    @CurrentUser() reqUser: { sub: number },
  ) {
    return await this.usersService.unbanUser(reqUser.sub, userId);
  }


  // Стафф контроллеры
  @Post(':id/make-owner')
  @Role('OWNER')
  @Throttle({ default: { limit: 1, ttl: 120000 } })
  async makeOwner(
    @Param('id', ParseIntPipe) userId: number,
    @CurrentUser() reqUser: { sub: number },
  ) {
    return await this.usersService.setRole(reqUser.sub, userId, 'OWNER');
  }

  @Post(':id/make-admin')
  @Role('OWNER')
  @Throttle({ default: { limit: 3, ttl: 120000 } })
  async makeAdmin(
    @Param('id', ParseIntPipe) userId: number,
    @CurrentUser() reqUser: { sub: number },
  ) {
    return await this.usersService.setRole(reqUser.sub, userId, 'ADMIN');
  }

  @Post(':id/make-player')
  @Role('OWNER')
  @Throttle({ default: { limit: 5, ttl: 120000 } })
  async makePlayer(
    @Param('id', ParseIntPipe) userId: number,
    @CurrentUser() reqUser: { sub: number },
  ) {
    return await this.usersService.setRole(reqUser.sub, userId, 'PLAYER');
  }
}
