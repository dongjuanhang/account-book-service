import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards, Request } from '@nestjs/common';
import { AUTH_TYPE, TRANSACTIONS_PATH } from '../consts';
import { AuthGuard } from '@nestjs/passport';
import { GetTransactionsDto } from './dto/get-transactions.dto';
import { get, toNumber } from 'lodash';
import { TransactionsService } from './transactions.service';
import { CreateOrAmendTransactionDto } from './dto/create-or-amend-transaction.dto';
import { User } from '../common/decorators/user.decorator';
import { User as UserEntity } from '../users/user.entity';
import { TransactionList } from './interfaces/transaction-list.interface';
import { TransactionDetail } from './interfaces/transaction-detail.interface';

@UseGuards(AuthGuard(AUTH_TYPE.JWT))
@Controller(TRANSACTIONS_PATH.ROOT)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async getList(@Query() query: GetTransactionsDto, @User() user: UserEntity): Promise<TransactionList> {
    const size = toNumber(get(query, 'size', 15));
    const page = toNumber(get(query, 'page', 1));
    return this.transactionsService.findList(size, page, user.userId);
  }

  @Get(`:${TRANSACTIONS_PATH.CODE_PARAM}`)
  async getDetail(@Param(TRANSACTIONS_PATH.CODE_PARAM) code: string): Promise<TransactionDetail> {
    return this.transactionsService.findOne(toNumber(code));
  }

  @Post()
  async create(@Body() data: CreateOrAmendTransactionDto, @User() user: UserEntity): Promise<{}> {
    const userId: string = get(user, 'userId');
    return this.transactionsService.createOrAmend(data, userId);
  }

  @Put(`:${TRANSACTIONS_PATH.CODE_PARAM}`)
  async amend(
    @Body() data: CreateOrAmendTransactionDto,
    @User() user: UserEntity,
    @Param(TRANSACTIONS_PATH.CODE_PARAM) code: string,
  ): Promise<{}> {
    const userId: string = get(user, 'userId');
    return this.transactionsService.createOrAmend(data, userId, toNumber(code));
  }

  @Delete(`:${TRANSACTIONS_PATH.CODE_PARAM}`)
  async remove(@Param(TRANSACTIONS_PATH.CODE_PARAM) code: string): Promise<{}> {
    return this.transactionsService.remove(toNumber(code));
  }
}
