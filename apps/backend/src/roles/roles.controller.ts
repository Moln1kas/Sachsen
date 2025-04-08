import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { AssignRoleDto } from './dto/assign-role.dto';
import { Roles } from 'src/common/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from './roles.guard';

@Controller('v1/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMINISTRATOR')
  @Post('/assign')
  async addRole(@Body() body: AssignRoleDto) {
    const { userId, role } = body;
    return await this.rolesService.assignRole(userId, role);
  }
}
