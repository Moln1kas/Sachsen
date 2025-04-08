import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ROOT_USERNAME = process.env.ROOT_USERNAME;
const ROOT_PASSWORD = process.env.ROOT_PASSWORD;

async function main() {
  const roleNames = ['PLAYER', 'MODERATOR', 'ADMINISTRATOR', 'TECH_MODERATOR', 'TECH_ADMINISTRATOR'];

  const roles = await Promise.all(
    roleNames.map(async (value) => {
      return prisma.role.upsert({
        where: { value },
        update: {},
        create: { value },
      });
    })
  );

  if(!ROOT_USERNAME && !ROOT_PASSWORD) return console.log('No data for create superuser.');

  const hashedPassword = await bcrypt.hash(ROOT_PASSWORD, 10);

  const rootUser = await prisma.user.upsert({
    where: { username: ROOT_USERNAME },
    update: {},
    create: {
      username: ROOT_USERNAME,
      password: hashedPassword,
      status: 'APPROVED',
      roles: {
        create: roles.map(role => ({
          role: { connect: { id: role.id } }
        })),
      },
    },
  });

  console.log('Superuser succefully created.')
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
