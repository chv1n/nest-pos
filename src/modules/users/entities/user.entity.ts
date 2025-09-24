import { Column, Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Exclude, Expose } from 'class-transformer';

@Entity({ name: "users" })
export class User {
    @PrimaryColumn()
    @Expose()
    uid: string;
    
    @Column({ unique : true })
    @Expose()
    phone: string;

    @Column()
    @Expose()
    first_name: string;

    @Column()
    @Expose()
    last_name: string;

    @Column({ nullable : false})
    @Exclude()
    passwordHashed: string;

    @Column()
    @Expose()
    role_id: string;

    @Column({ type: 'boolean', default: true })
    @Expose()
    is_active: boolean;

    @CreateDateColumn()
    @Expose()
    createdAt: Date;   

    @UpdateDateColumn()
    updatedAt: Date;
}
