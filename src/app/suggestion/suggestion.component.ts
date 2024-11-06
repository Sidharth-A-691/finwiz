import { Component } from '@angular/core';
import { SuggestionService } from '../services/suggestion/suggestion.service';
import { Transaction } from '../model/Transaction';
import { Budget } from '../model/Budget';

@Component({
  selector: 'app-suggestion',
  templateUrl: './suggestion.component.html',
  styleUrls: ['./suggestion.component.css']
})
export class SuggestionComponent {
  
  transactions: any[] = [ {
    "id": 1,
    "amount": 150.0,
    "userId": 1,
    "description": "Deposit for savings",
    "balance": 20150.0,
    "accountNumber": "ACC123456",
    "transactionDate": "2024-11-05",
    "transactionType": "DEPOSIT",
    "categoryType": "HOUSING"
},
{
    "id": 2,
    "amount": 100.0,
    "userId": 1,
    "description": "Burger",
    "balance": 20050.0,
    "accountNumber": "ACC123456",
    "transactionDate": "2024-11-05",
    "transactionType": "WITHDRAW",
    "categoryType": "FOOD"
},
{
    "id": 3,
    "amount": 100.0,
    "userId": 1,
    "description": "Burger",
    "balance": 20150.0,
    "accountNumber": "ACC123456",
    "transactionDate": "2024-11-05",
    "transactionType": "DEPOSIT",
    "categoryType": "HOUSING"
},
{
    "id": 4,
    "amount": 100.0,
    "userId": 1,
    "description": "Burger",
    "balance": 20250.0,
    "accountNumber": "ACC123456",
    "transactionDate": "2024-11-05",
    "transactionType": "WITHDRAW",
    "categoryType": "FOOD"
},
{
    "id": 5,
    "amount": 100.0,
    "userId": 1,
    "description": "Burger",
    "balance": 20350.0,
    "accountNumber": "ACC123456",
    "transactionDate": "2024-11-05",
    "transactionType": "WITHDRAW",
    "categoryType": "TRANSPORTATION"
},
{
    "id": 6,
    "amount": 100.0,
    "userId": 1,
    "description": "Burger",
    "balance": 20450.0,
    "accountNumber": "ACC123456",
    "transactionDate": "2024-11-05",
    "transactionType": "WITHDRAW",
    "categoryType": "HOUSING"
},
{
    "id": 7,
    "amount": 100.0,
    "userId": 1,
    "description": "Burger",
    "balance": 20550.0,
    "accountNumber": "ACC123456",
    "transactionDate": "2024-11-05",
    "transactionType": "WITHDRAW",
    "categoryType": "ENTERTAINMENT",
}];
  budgetSuggestion: string = '';  // Store the AI-generated budget suggestion
  loading: boolean = false;
  errorMessage: string = '';
  budgetList: any[] = []; // Array to store the budgets
  currentBudget: Budget | null = null; 

  constructor(private suggestionService: SuggestionService) {}

  // loadTransactions(): void {
  //   this.suggestionService.getTransactions().subscribe((data: Transaction[]) => {
  //     this.transactions = data;
  //   });
  // }

  // Method triggered when user asks for budget suggestion
  async onGetBudgetSuggestion(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';
    this.budgetSuggestion = '';  // Clear previous suggestion

    try {
      // Get the budget suggestion based on the transactions
      const suggestion = await this.suggestionService.generateBudgetSuggestion(this.transactions);
      // Store the suggestion to display in the UI
     // this.currentBudget = this.suggestionService.parseAiGeneratedBudgetResponse(suggestion, 1); 
      this.budgetSuggestion = suggestion;
    } catch (error) {
      this.errorMessage = 'An error occurred while generating the budget suggestion.';
    } finally {
      this.loading = false;
    }
  }

  // Method to add AI-generated budget to the table
  addBudgetToTable(): void {
    if (this.budgetSuggestion) {
      // Parse the budget suggestion to extract the details
      const budgetId = 'BUD-' + (this.budgetList.length + 1); // Auto-generate a budget ID
      const startDate = new Date().toLocaleDateString();
      const endDate = new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString();
      const food = this.currentBudget?.food;
      const housing = this.extractBudgetValue('Housing');
      const transportation = this.extractBudgetValue('Transportation');
      const entertainment = this.extractBudgetValue('Entertainment');
      const exceeded = false; // Logic can be added to track exceeded budgets

      // Push the new budget object to the list
      this.budgetList.push({
        id: this.budgetList.length + 1,
        budgetId,
        startDate,
        endDate,
        food,
        housing,
        transportation,
        entertainment,
        exceeded,
      });
      // Optionally, reset the budget suggestion after saving it
      this.budgetSuggestion = '';
    }
  }
  // Helper function to extract the budget value from the suggestion string
  extractBudgetValue(category: string): number {
    const regex = new RegExp(`Budget for ${category}:\\s*\\$([\\d,\\.]+)`);
    const match = this.budgetSuggestion.match(regex);
    return match ? parseFloat(match[1].replace(',', '')) : 0;
  }
  formatResponse(response: string): string {
    response = response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold
    response = response.replace(/\*(.*?)\*/g, '<em>$1</em>'); // Italic
    response = response.replace(/\n/g, '<br/>'); // Line breaks
    response = response.replace(/^(\d+)\. (.*)/gm, '<ol><li>$2</li></ol>'); // Numbered list
    response = response.replace(/^\* (.*)/gm, '<ul><li>$1</li></ul>'); // Bullet list
    return response;
  }
}