import { Product } from 'src/modules/products/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity("categories")
export class Category {
    @PrimaryColumn()
    categ_id: string;

    @Column({ unique: true })
    categ_name: string;

    @Column({ default: true })
    is_active: boolean;


    @OneToMany(() => Product, product => product.category)
    products: Product[]
}
