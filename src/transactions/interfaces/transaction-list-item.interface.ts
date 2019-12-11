export interface TransactionListItem {
  transactionCode: number;
  amount: number;
  remark: string;
  isExpense: boolean;
  categoryName: string;
  date: string;
}
