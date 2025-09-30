import { Column, Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('roles')
export class Role {
  @PrimaryColumn() 
  role_id: string;

  @Column({ unique: true })
  role_name: string;

  @Column({ default: true })
  is_active: boolean;
}