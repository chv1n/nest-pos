import { Category } from 'src/modules/categories/entities/category.entity'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

@Entity('products')
export class Product {
    @PrimaryColumn()
    product_id: string

    @Column()
    product_name: string

    @Column('numeric', { precision: 10, scale: 2 })
    price: number

    @Column()
    description: string

    @Column('int')
    stock: number

    @Column('int')
    cost_price: number


    @Column()
    is_active: boolean

    @ManyToOne(() => Category, category => category.products)
    @JoinColumn({ name: 'category_id' })
    category: Category
    
    @Column({ name: 'category_id' })
    category_id: string
}
