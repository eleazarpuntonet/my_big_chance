import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User, Store, Product, StoreProduct } from './entities';
import { AuthModule } from './auth/auth.module';
import { StoresModule } from './stores/stores.module';
import { ProductsModule } from './products/products.module';
import { StoreProductsModule } from './store-products/store-products.module';
import { SeedsModule } from './seeds/seeds.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'postgres',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Store, Product, StoreProduct],
      synchronize: process.env.NODE_ENV !== 'production', // Temporarily enabled for seeding
      logging: process.env.NODE_ENV === 'development',
    }),
    AuthModule,
    StoresModule,
    ProductsModule,
    StoreProductsModule,
    SeedsModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
