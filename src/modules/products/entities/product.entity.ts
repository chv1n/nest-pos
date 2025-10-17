import { Category } from 'src/modules/categories/entities/category.entity'
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm'

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

    // @Column('int', {default: 0})
    // stock: number;

    @Column({default : true})
    is_active: boolean;

    @ManyToOne(() => Category, category => category.products)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column({ name: 'category_id' })
    category_id: string;

    @CreateDateColumn()
    create_at : Date;

    @UpdateDateColumn()
    update_at : Date;
}
