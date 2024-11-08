import { Component } from '@angular/core';
import { SuggestionService } from '../services/suggestion/suggestion.service';
import { Transaction } from '../model/Transaction';
import { Budget } from '../model/Budget';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-suggestion',
  templateUrl: './suggestion.component.html',
  styleUrls: ['./suggestion.component.css'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),  // Content starts slightly down and invisible
        animate('0.5ms', style({ transform: 'translateY(0)', opacity: 1 }))  // Content slides up
      ]),
      transition(':leave', [
        animate('0.5ms', style({ transform: 'translateY(100%)', opacity: 0 }))  // Fade out while sliding down
      ])
    ]),

    // Slide up animation for the background
    trigger('slideUp', [
      transition(':enter', [
        style({ backgroundPosition: 'center 20%' }),  // Start with background position 20% down
        animate('0.8s ease-out', style({ backgroundPosition: 'center 50%' }))  // Slide up to its final position
      ])
    ]),
    trigger('moveUp', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),  // Start with content hidden below
        animate('750ms ease-out', style({ transform: 'translateY(0)' }))  // Slide up to position
      ])
    ])
  ]
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
}
    // Your transaction data here
  ];
  
  budgetSuggestion: string = '';  // Store the AI-generated budget suggestion
  loading: boolean = false;
  errorMessage: string = '';
  budgetList: any[] = []; // Array to store the budgets
  currentBudget: Budget | null = null; 

  constructor(private suggestionService: SuggestionService) {}

  // Method triggered when user asks for budget suggestion
  async onGetBudgetSuggestion(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';
    this.budgetSuggestion = '';  // Clear previous suggestion

    try {
      // Get the budget suggestion based on the transactions
      const suggestion = await this.suggestionService.generateBudgetSuggestion(this.transactions);
      this.budgetSuggestion = suggestion;
      // You may want to parse the suggestion into a Budget object
      // this.currentBudget = this.suggestionService.parseAiGeneratedBudgetResponse(suggestion, 1); 
    } catch (error) {
      this.errorMessage = 'An error occurred while generating the budget suggestion.';
    } finally {
      this.loading = false;
    }
  }

  // Method to regenerate budget suggestion when button is clicked
  async onRegenerateBudgetSuggestion(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';
    
    try {
      // Regenerate the budget suggestion based on the transactions
      const regeneratedSuggestion = await this.suggestionService.generateBudgetSuggestion(this.transactions);
      this.budgetSuggestion = regeneratedSuggestion;
      // If you parse the suggestion into a Budget object, you could do that here
      // this.currentBudget = this.suggestionService.parseAiGeneratedBudgetResponse(regeneratedSuggestion, 1);
    } catch (error) {
      this.errorMessage = 'An error occurred while regenerating the budget suggestion.';
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

  // Helper function to format the response text (bold, italic, line breaks, etc.)
  formatResponse(response: string): string {
    response = response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold
    response = response.replace(/\*(.*?)\*/g, '<em>$1</em>'); // Italic
    response = response.replace(/\n/g, '<br/>'); // Line breaks
    response = response.replace(/^(\d+)\. (.*)/gm, '<ol><li>$2</li></ol>'); // Numbered list
    response = response.replace(/^\* (.*)/gm, '<ul><li>$1</li></ul>'); // Bullet list
    return response;
  }
}