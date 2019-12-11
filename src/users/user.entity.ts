import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { TABLE_NAMES } from '../consts';
import { Transaction } from '../transactions/transaction.entity';
import { Category } from '../categories/category.entity';

@Entity(TABLE_NAMES.USERS)
export class User {
  @PrimaryGeneratedColumn('uuid', {
    name: 'user_id',
  })
  userId: string;

  @Column({
    name: 'user_name',
    type: 'varchar',
    length: 8,
  })
  username: string;

  @Column({
    name: 'user_password',
    type: 'varchar',
    length: 255,
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  salt: string;

  @CreateDateColumn({
    name: 'user_create_time',
    type: 'datetime',
  })
  createTime: Date;

  @UpdateDateColumn({
    name: 'user_update_time',
    type: 'datetime',
  })
  updateTime: Date;

  @OneToMany(
    type => Transaction,
    transaction => transaction.user,
    {})
  transactions: Transaction[];

  @OneToMany(type => Category, category => category.user)
  categories: Category[];
}
