import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email }
    })
  }

  async findById(id: number) {
    return await this.prisma.user.findUnique({
      where: { id }
    })
  }
}
