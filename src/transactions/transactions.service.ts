import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { CreateOrAmendTransactionDto } from './dto/create-or-amend-transaction.dto';
import { User } from '../users/user.entity';
import { Category } from '../categories/category.entity';
import { map, get } from 'lodash';
import { TransactionList } from './interfaces/transaction-list.interface';
import { TransactionDetail } from './interfaces/transaction-detail.interface';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) { }

  public async findList(size: number, page: number, userId: string): Promise<TransactionList> {
    const user = await this.findUser(userId);
    const [transactions, count] = await this.transactionRepository.findAndCount({
      skip: ((page - 1) * size),
      relations: ['category'],
      take: size,
      order: {
        date: 'DESC',
      },
      where: {
        user,
      },
    });
    return {
      list: map(transactions, transaction => {
        const {
          createTime,
          updateTime,
          category,
          ...data
        } = transaction;
        return {
          categoryName: category.categoryName,
          isExpense: category.isExpense,
          ...data,
        };
      }),
      pagination: {
        size,
        page,
        total: count,
      },
      order: 'DESC',
      orderBy: 'date',
    };
  }

  public async findOne(transactionCode: number): Promise<TransactionDetail> {
    const {
      category,
      createTime,
      updateTime,
      ...transaction
    } = await this.transactionRepository.findOneOrFail(transactionCode, { relations: ['category'] });
    return {
      categoryCode: category.categoryCode,
      isExpense: category.isExpense,
      ...transaction,
    };
  }

  public async createOrAmend(data: CreateOrAmendTransactionDto, userId: string, transactionCode?: number): Promise<{}> {
    const user = await this.findUser(userId);
    const transaction = transactionCode ? await this.transactionRepository.findOneOrFail(transactionCode, { where: { user } }) : new Transaction();
    transaction.amount = data.amount;
    transaction.user = user;
    transaction.category = await this.findCategory(data.categoryCode);
    transaction.date = data.date;
    transaction.remark = data.remark;
    await this.transactionRepository.save(transaction);
    return {};
  }

  public async remove(transactionCode: number): Promise<{}> {
    await this.transactionRepository.delete(transactionCode);
    return {};
  }

  private async findUser(userId: string): Promise<User> {
    return this.userRepository.findOneOrFail({
      where: { userId },
    });
  }

  private async findCategory(categoryCode: number): Promise<Category> {
    return this.categoryRepository.findOneOrFail({
      where: { categoryCode },
    });
  }
}
