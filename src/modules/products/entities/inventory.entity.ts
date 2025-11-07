import {
  Column,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'inventory' })
export class Inventory {
  @PrimaryColumn()
  inventory_id: string;

  @Column()
  product_id: string;

  @Column('int')
  current_stock: number;

  @Column('int')
  minimum_stock: number;

  @UpdateDateColumn()
  last_updated: Date;

  @OneToOne(() => Product, (product) => product.inventory)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
