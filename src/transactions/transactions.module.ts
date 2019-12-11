import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { AuthModule } from '../auth/auth.module';
import { TransactionsService } from './transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Transaction } from './transaction.entity';
import { Category } from '../categories/category.entity';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
  imports: [
    TypeOrmModule.forFeature([User, Transaction, Category]),
  ],
})
export class TransactionsModule {}
