import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity("categories")
export class Category {
    @PrimaryColumn()
    categ_id: string;

    @Column()
    categ_name: string;

    @Column({ default: true })
    is_active : boolean;

}
