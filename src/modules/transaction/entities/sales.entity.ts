import {
  Column,
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { SaleDetail } from './sales-detail.entity';

@Entity({ name: 'sales' })
export class Sales {
  @PrimaryColumn()
  sales_id: string;

  @CreateDateColumn()
  sales_date: Date;

  @UpdateDateColumn({ nullable: true })
  paid_date: Date;

  @Column()
  total_amount: number;

  @Column({ nullable: true })
  change: number;

  @Column({ nullable: true })
  paid_amount: number;

  @Column({ nullable: true })
  payment_method: number;

  @Column({ default: 'Pending' })
  status: string;

  @OneToMany(() => SaleDetail, (saleDetail) => saleDetail.sale)
  details: SaleDetail;
}
