import { Column, Entity, PrimaryColumn, UpdateDateColumn, JoinColumn, OneToOne } from "typeorm";
import { Product } from "./product.entity";

@Entity({ name: "inventory" })
export class Inventory {
    @PrimaryColumn()
    @OneToOne(() => Product, (product) => product.inventory)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column()
    current_stock: number;

    @Column('int')
    minimum_stock: number;

    @UpdateDateColumn()
    last_updated: Date;
}
