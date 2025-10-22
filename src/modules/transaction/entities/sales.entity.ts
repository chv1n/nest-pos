import { Column, Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { SaleDetail } from "./sales-detail.entity";

@Entity({ name: "sales" })
export class Sales {
    @PrimaryColumn()
    sales_id : string;

    @CreateDateColumn()
    sales_date : Date;

    // @Column()
    // user_id : string;

    @Column()
    total_amount : number;

    @Column()
    paid_amount: number;

    @OneToMany(() => SaleDetail, saleDetail => saleDetail.sale)
    details: SaleDetail;

}
