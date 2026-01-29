const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create user for submission.json
  const testUser = await prisma.user.upsert({
    where: { email: 'test.user@example.com' },
    update: {},
    create: {
      email: 'test.user@example.com',
      name: 'Test User',
      image: 'https://via.placeholder.com/150',
    },
  });

  console.log({ testUser });

  // Create products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Wireless Headphones',
        description: 'Premium noise-cancelling wireless headphones.',
        price: 299.99,
        imageUrl: 'https://via.placeholder.com/300?text=Headphones',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Smartphone',
        description: 'Latest model with high-resolution camera.',
        price: 899.99,
        imageUrl: 'https://via.placeholder.com/300?text=Smartphone',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Laptop',
        description: 'Powerful laptop for professionals.',
        price: 1299.99,
        imageUrl: 'https://via.placeholder.com/300?text=Laptop',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Smart Watch',
        description: 'Track your fitness and stay connected.',
        price: 199.99,
        imageUrl: 'https://via.placeholder.com/300?text=Watch',
      },
    }),
  ]);

  console.log({ products });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
