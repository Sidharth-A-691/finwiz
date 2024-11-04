import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaction } from './Transaction';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BankingService {

  constructor(private http: HttpClient) { }

  addTransaction(transaction: Transaction): Observable<Transaction> {
    const url1 = 'http://localhost:8000/api/transactions/transaction'; 
    return this.http.post<Transaction>(url1, transaction);
  }

  getTransactions(): Observable<Transaction[]> {
    const url = 'http://localhost:8000/api/transactions/all'; 
    return this.http.get<Transaction[]>(url);
  }
}