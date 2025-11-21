import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Store } from './store.entity';
import { Product } from './product.entity';

@Entity('store_products')
export class StoreProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  storeId: string;

  @Column('uuid')
  productId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Store, store => store.storeProducts)
  @JoinColumn({ name: 'storeId' })
  store: Store;

  @ManyToOne(() => Product, product => product.storeProducts)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}