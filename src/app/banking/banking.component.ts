import { Component, OnInit } from '@angular/core';
import { Transaction } from '../Transaction';
import { BankingService } from '../banking.service';

@Component({
  selector: 'app-banking',
  templateUrl: './banking.component.html',
  styleUrls: ['./banking.component.css']
})
export class BankingComponent implements OnInit {

  accountNumber: string = '';
  description: string = '';
  amount: number = 0;
  transactionType: string = '';
  categoryType: string = '';

  transaction: Transaction = new Transaction('','', 0,'','');
  transactions: Transaction[] = [];

  constructor(private bankingService: BankingService) { }

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.bankingService.getTransactions().subscribe((data: Transaction[]) => {
      this.transactions = data;
    });
  }

  onSubmit(): void {
    this.bankingService.addTransaction(this.transaction).subscribe((newTransaction: Transaction) => {
      this.transactions.push(newTransaction); 
      this.transaction = new Transaction('','', 0,'','');
    });
  }
}


