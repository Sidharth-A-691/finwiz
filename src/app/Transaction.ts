export class Transaction {
    accountNumber: string;
    description: string;
    amount: number;
    transactionType: string;
    categoryType: string;

constructor (accountNumber: string, description: string, amount: number, transactionType: string, categoryType: string)
{
    this.accountNumber = accountNumber;
    this.description = description;
    this.amount = amount;
    this.transactionType = transactionType;
    this.categoryType = categoryType;
}
}