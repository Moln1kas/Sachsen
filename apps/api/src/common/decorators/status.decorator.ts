import { SetMetadata } from '@nestjs/common';
import { UserStatus } from '@prisma/client';

export const STATUS_KEY = 'status';
export const Status = (...status: UserStatus[]) => SetMetadata(STATUS_KEY, status);
