import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const ROLES_KEY = 'role';
export const Role = (...role: UserRole[]) => SetMetadata(ROLES_KEY, role);
