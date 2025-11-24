import { NestFactory } from '@nestjs/core';

// Dynamic imports based on environment
const isProduction = process.env.NODE_ENV === 'production';
const basePath = isProduction ? './dist/src' : './src';
const ext = isProduction ? '.js' : '';

async function bootstrap() {
  // Dynamic imports
  const { AppModule } = await import(`${basePath}/app.module${ext}`);
  const { SeedsService } = await import(`${basePath}/seeds/seeds.service${ext}`);

  // Enable sync for seeding
  process.env.SEEDING = 'true';

  const app = await NestFactory.createApplicationContext(AppModule);
  const seedsService = app.get(SeedsService);

  try {
    await seedsService.seed();
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }

  await app.close();
  process.exit(0);
}

bootstrap();