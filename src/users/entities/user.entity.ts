import { Column, Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";


@Entity({ name: "users" })
export class User {
    @PrimaryColumn()
    uid: string;
    
    @Column({ unique : true })
    phone: string;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column({ nullable : false})
    passwordHashed: string;

    @Column()
    role_id: string;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @CreateDateColumn()
    createdAt: Date;   

    @UpdateDateColumn()
    updatedAt: Date;
}
