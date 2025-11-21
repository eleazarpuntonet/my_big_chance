import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from '../entities/store.entity';
import { Product } from '../entities/product.entity';
import { StoreProduct } from '../entities/store-product.entity';

@Injectable()
export class SeedsService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(StoreProduct)
    private storeProductRepository: Repository<StoreProduct>,
  ) {}

  async seed(): Promise<void> {
    console.log('Starting database seeding...');

    // Create stores
    const stores = await this.createStores();

    // Create products
    const products = await this.createProducts();

    // Create store-product associations
    await this.createStoreProducts(stores, products);

    console.log('Database seeding completed!');
  }

  private async createStores(): Promise<Store[]> {
    const storeData = [
      {
        name: 'Supermercado Central',
        description: 'Tienda principal con productos frescos',
        address: 'Av. Principal 123, Ciudad Central',
        phone: '+1234567890',
      },
      {
        name: 'Tienda del Barrio',
        description: 'Tienda de conveniencia local',
        address: 'Calle Secundaria 456, Barrio Norte',
        phone: '+1234567891',
      },
      {
        name: 'Mega Store',
        description: 'Tienda grande con variedad completa',
        address: 'Plaza Mayor 789, Centro Comercial',
        phone: '+1234567892',
      },
    ];

    const stores: Store[] = [];
    for (const data of storeData) {
      const store = this.storeRepository.create(data);
      const savedStore = await this.storeRepository.save(store);
      stores.push(savedStore);
      console.log(`Created store: ${savedStore.name}`);
    }

    return stores;
  }

  private async createProducts(): Promise<Product[]> {
    const productData = [
      {
        name: 'Leche Entera',
        description: 'Leche fresca pasteurizada',
        basePrice: 2.50,
        category: 'Lácteos',
      },
      {
        name: 'Pan Integral',
        description: 'Pan de trigo integral recién horneado',
        basePrice: 1.80,
        category: 'Panadería',
      },
      {
        name: 'Manzanas Rojas',
        description: 'Manzanas frescas de temporada',
        basePrice: 3.20,
        category: 'Frutas',
      },
      {
        name: 'Arroz Blanco',
        description: 'Arroz de grano largo',
        basePrice: 1.50,
        category: 'Granos',
      },
      {
        name: 'Aceite de Oliva',
        description: 'Aceite de oliva extra virgen',
        basePrice: 8.90,
        category: 'Aceites',
      },
      {
        name: 'Queso Cheddar',
        description: 'Queso cheddar madurado',
        basePrice: 5.40,
        category: 'Lácteos',
      },
      {
        name: 'Pollo Entero',
        description: 'Pollo fresco de granja',
        basePrice: 7.20,
        category: 'Carnes',
      },
      {
        name: 'Pasta Espagueti',
        description: 'Pasta italiana de trigo duro',
        basePrice: 1.20,
        category: 'Pastas',
      },
      {
        name: 'Café Molido',
        description: 'Café 100% arábica molido',
        basePrice: 4.50,
        category: 'Bebidas',
      },
      {
        name: 'Azúcar Blanca',
        description: 'Azúcar refinada',
        basePrice: 2.10,
        category: 'Especias',
      },
      {
        name: 'Tomates',
        description: 'Tomates frescos',
        basePrice: 2.80,
        category: 'Verduras',
      },
      {
        name: 'Huevos',
        description: 'Huevos de gallinas libres',
        basePrice: 3.60,
        category: 'Lácteos',
      },
      {
        name: 'Yogur Natural',
        description: 'Yogur natural sin azúcar',
        basePrice: 1.90,
        category: 'Lácteos',
      },
      {
        name: 'Cereal de Maíz',
        description: 'Cereal crujiente de maíz',
        basePrice: 2.30,
        category: 'Cereales',
      },
      {
        name: 'Jabón en Barra',
        description: 'Jabón natural para manos',
        basePrice: 1.40,
        category: 'Limpieza',
      },
      {
        name: 'Detergente Líquido',
        description: 'Detergente para ropa',
        basePrice: 3.80,
        category: 'Limpieza',
      },
      {
        name: 'Papel Higiénico',
        description: 'Papel higiénico suave',
        basePrice: 2.90,
        category: 'Higiene',
      },
      {
        name: 'Shampoo',
        description: 'Shampoo para cabello normal',
        basePrice: 4.20,
        category: 'Higiene',
      },
      {
        name: 'Cepillo de Dientes',
        description: 'Cepillo de dientes suave',
        basePrice: 1.80,
        category: 'Higiene',
      },
      {
        name: 'Pasta Dental',
        description: 'Pasta dental con flúor',
        basePrice: 2.50,
        category: 'Higiene',
      },
    ];

    const products: Product[] = [];
    for (const data of productData) {
      const product = this.productRepository.create(data);
      const savedProduct = await this.productRepository.save(product);
      products.push(savedProduct);
      console.log(`Created product: ${savedProduct.name}`);
    }

    return products;
  }

  private async createStoreProducts(stores: Store[], products: Product[]): Promise<void> {
    // For each store, add a random selection of products with different prices and stock
    for (const store of stores) {
      // Select random products for this store (between 8-15 products per store)
      const numProducts = Math.floor(Math.random() * 8) + 8;
      const shuffledProducts = [...products].sort(() => 0.5 - Math.random());
      const selectedProducts = shuffledProducts.slice(0, numProducts);

      for (const product of selectedProducts) {
        // Add some variation to price (±20%) and random stock (0-50)
        const priceVariation = (Math.random() - 0.5) * 0.4; // ±20%
        const basePrice = product.basePrice || 1;
        const price = Math.round((basePrice * (1 + priceVariation)) * 100) / 100;
        const stock = Math.floor(Math.random() * 51); // 0-50

        const storeProduct = this.storeProductRepository.create({
          storeId: store.id,
          productId: product.id,
          price,
          stock,
        });

        await this.storeProductRepository.save(storeProduct);
        console.log(`Added ${product.name} to ${store.name} (Price: $${price}, Stock: ${stock})`);
      }
    }
  }
}