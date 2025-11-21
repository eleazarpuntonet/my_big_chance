import { NestFactory } from '@nestjs/core';
import { SeedsModule } from './src/seeds/seeds.module';
import { SeedsService } from './src/seeds/seeds.service';
import { AppModule } from './src/app.module';

async function bootstrap() {
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