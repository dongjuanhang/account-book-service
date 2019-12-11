import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CategoriesModule } from './categories/categories.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Transaction } from './transactions/transaction.entity';
import { Category } from './categories/category.entity';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionWrapper } from './common/filters/global.filter';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    TransactionsModule,
    CategoriesModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'djh1993',
      database: 'account_book',
      entities: [User, Transaction, Category],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ExceptionWrapper,
    },
  ],
})
export class AppModule { }
