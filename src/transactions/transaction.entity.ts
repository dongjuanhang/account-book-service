import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { TABLE_NAMES } from '../consts';
import { User } from '../users/user.entity';
import { Category } from '../categories/category.entity';

@Entity(TABLE_NAMES.TRANSACTIONS)
export class Transaction {
  @PrimaryGeneratedColumn({
    name: 'transaction_code',
  })
  transactionCode: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  amount: number;

  @Column({
    type: 'varchar',
    length: 200,
  })
  remark: string;

  @Column({
    type: 'date',
  })
  date: string;

  @CreateDateColumn({
    name: 'transaction_create_time',
    type: 'datetime',
  })
  createTime: Date;

  @UpdateDateColumn({
    name: 'transaction_update_time',
    type: 'datetime',
  })
  updateTime: Date;

  @ManyToOne(
    type => User,
    user => user.transactions,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
      nullable: false,
    },
  )
  @JoinColumn({
    name: 'fk_transactions_user_id',
  })
  user: User;

  @ManyToOne(
    type => Category, category => category.transactions,
    {
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
      nullable: false,
    },
  )
  @JoinColumn({
    name: 'fk_transactions_category_code',
  })
  category: Category;
}
