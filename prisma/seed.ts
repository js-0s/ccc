import { PrismaClient } from '@prisma/client';
import { uniqueName } from '@/lib/uniqueName';
import { ShopRepository, ShopUserRepository } from '@/graphql/repository/Shop';
import { OrderRepository } from '@/graphql/repository/Order';
import { db } from '@/server/db';

const users = [
  'admin@local.host',
  'user1@local.host',
  'user@local.host',
];
// testtest
const defaultPasswordHash =
  '$2a$10$8l8PW01iLwKI1s8XF/S48.UHq8BR5fjO7aK.v03lypitS0FOyZVii';

const context = {
  db,
  ability: { can: () => true, subject: () => null },
};
async function main() {
  // clean up
  await context.db.user.deleteMany();

  const seedUsers = await Promise.all(
    users.map(user => {
      let roles = [];
      if (user.includes('admin')) {
        roles.push('admin');
      }
      if (user.includes('user')) {
        roles.push('user');
      }
      return context.db.user.create({
        data: {
          email: user.toLowerCase(),
          name: user.replace(/@.*/, ''),
          password: defaultPasswordHash,
          createdAt: new Date(),
          phone: '01234567',
          location: {
            create: {
              latitude: 52 + Math.random() * 2,
              longitude: 50 + Math.random() * 2,
            },
          },
          image: '/images/no-user-image.jpg',
          roles,
        },
      });
    }),
  );
  const seedUser = username => {
    return seedUsers.find(
      user => user.email.toLowerCase() === username.toLowerCase(),
    );
  };
  // when populating other relations, use seedUser('user1').id as createdBy
}

main()
  .then(async () => {
    await context.db.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await context.db.$disconnect();
    process.exit(1);
  });
