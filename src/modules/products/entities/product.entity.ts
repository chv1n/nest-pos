import { Category } from 'src/modules/categories/entities/category.entity'
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm'
import { Inventory } from './inventory.entity';

@Entity('products')
export class Product {
    @PrimaryColumn()
    product_id: string;

    @Column()
    product_name: string;

    @Column('numeric', { precision: 10, scale: 2 })
    price: number;

    @Column('numeric', { precision: 10, scale: 2 })
    cost_price: number;

    @Column()
    description: string;

    @Column({ default: true })
    is_active: boolean;

    @OneToOne(() => Inventory, (inventory) => inventory.product)
    inventory: Inventory;

    @ManyToOne(() => Category, category => category.products)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column({ name: 'category_id' })
    category_id: string;

    @CreateDateColumn()
    create_at: Date;

    @UpdateDateColumn()
    update_at: Date;
}
