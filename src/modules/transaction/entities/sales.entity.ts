import { Column, Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";

@Entity({ name: "sales" })
export class Sales {
    @PrimaryColumn()
    sales_id : string;

    @Column()
    sales_data : Date;

    @Column()
    user_id : string;

    @Column()
    total_amount : number;

    @Column()
    paid_amount: number;

    @Column()
    change_amount : number;
}
