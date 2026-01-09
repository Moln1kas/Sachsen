import { BadRequestException, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-access.guard';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminUsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get()
  @Role('ADMIN', 'OWNER')
  async findAll(
    @Query('page', ParseIntPipe) pageQuery: number = 1,
    @Query('limit', ParseIntPipe) limitQuery: number = 10,
  ) {
    const page = Math.max(pageQuery || 1, 1);
    const limit = Math.max(limitQuery || 10, 1);

    const skip = (page - 1) * limit;
    const users = await this.usersService.findMany({ skip, take: limit });
    const total = await this.usersService.count();

    return { total, page, limit, users };
  }

  @Post(':id/approve')
  @Role('ADMIN', 'OWNER')
  async approveUser(@Param('id', ParseIntPipe) userId: number,) {}

  @Post(':id/reject')
  @Role('ADMIN', 'OWNER')
  async rejectUser(@Param('id', ParseIntPipe) userId: number,) {}

  @Post(':id/ban')
  @Role('ADMIN', 'OWNER')
  async banUser(
    @Param('id', ParseIntPipe) userId: number,
    @CurrentUser() reqUser: { sub: number },
  ) {
    return this.usersService.banUser(reqUser.sub, userId);
  }

  @Post(':id/unban')
  @Role('ADMIN', 'OWNER')
  async unbanUser(
    @Param('id', ParseIntPipe) userId: number,
    @CurrentUser() reqUser: { sub: number },
  ) {
    return this.usersService.unbanUser(reqUser.sub, userId);
  }

  @Post(':id/make-admin')
  @Role('ADMIN', 'OWNER')
  async makeAdmin(@Param('id', ParseIntPipe) userId: number,) {}

  @Post(':id/make-player')
  @Role('ADMIN', 'OWNER')
  async makePlayer(@Param('id', ParseIntPipe) userId: number,) {}
}
