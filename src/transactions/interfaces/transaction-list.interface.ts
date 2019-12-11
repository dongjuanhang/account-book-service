import { TransactionListItem } from './transaction-list-item.interface';

export interface TransactionList {
  list: TransactionListItem[];
  pagination: {
    size: number,
    page: number,
    total: number,
  };
  order: string;
  orderBy: string;
}
