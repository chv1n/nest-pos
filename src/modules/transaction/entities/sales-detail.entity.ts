import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Sales } from './sales.entity'; 
import { Product } from '../../products/entities/product.entity'; 

@Entity('sale_details')
export class SaleDetail {
    
    @PrimaryGeneratedColumn()
    sale_detail_id: number; 

    @Column()
    sale_id: number; 

    @Column()
    product_id: number; 

    @Column()
    quantity: number; 

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    unit_price: number; 

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    line_discount: number; 

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    lineTotal: number; 

    @ManyToOne(() => Sales, sale => sale.details)
    @JoinColumn({ name: 'sale_id' })
    sale: Sales;

    @ManyToOne(() => Product, product => product.sale_details)
    @JoinColumn({ name: 'product_id' })
    product: Product;
}