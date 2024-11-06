
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Transaction } from 'src/app/model/Transaction';
import { HttpClient } from '@angular/common/http';
import { Budget } from 'src/app/model/Budget';

@Injectable({
  providedIn: 'root'
})
export class SuggestionService {

  private genAi: GoogleGenerativeAI;
  private model: any;


  constructor(private http: HttpClient) {
    this.genAi = new GoogleGenerativeAI("AIzaSyChX9wjdsFCNuWunB_7PhMPU1UxJDDJmOI");
    this.model = this.genAi.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  // getTransactions(): Observable<Transaction[]> {
  //   const url = 'http://localhost:8000/api/transactions/all'; 
  //   return this.http.get<Transaction[]>(url);
  // }

  async generateBudgetSuggestion(transactions: any[]): Promise<string> {
    const prompt = this.createBudgetPrompt(transactions);
    
    const userId : number = 1
    try {
      const result = await this.model.generateContent(prompt);

      // const generatedBudget = this.parseAiGeneratedBudgetResponse(result.response.text(), userId);
      // this.saveBudget(generatedBudget).subscribe(
      //   (savedBudget) => {
      //     console.log('Budget saved successfully:', savedBudget);
      //   },
      //   (error) => {
      //     console.error('Error saving budget:', error);
      //   }
      // );

      return result.response.text();
    } catch (error) {
      console.error("Error generating budget:", error);
      throw new Error("Could not generate budget suggestion.");
    }
  }
  // Helper function to create a detailed prompt based on transaction data
  createBudgetPrompt(transactions: any[]): string {
    // Summarize the transaction data (you could make this more complex, but for simplicity we summarize it here)
    let income = 0;
    let expenses = 0;
    let foodExpenses = 0;
    let entertainmentExpenses = 0;
    let housingExpenses = 0;
    let transportationExpenses = 0;

    transactions.forEach(transaction => {
      if (transaction.transactionType === 'DEPOSIT') {
        income += transaction.amount;
      } else if (transaction.transactionType === 'WITHDRAW') {
        expenses += transaction.amount;
        if (transaction.categoryType === 'FOOD') {
          foodExpenses += transaction.amount;
        } else if (transaction.categoryType === 'ENTERTAINMENT') {
          entertainmentExpenses += transaction.amount;
        } else if (transaction.categoryType === 'HOUSING') {
          housingExpenses += transaction.amount;
        } else if (transaction.categoryType === 'TRANSPORTATION') {
          transportationExpenses += transaction.amount;
        }
      }
    });
  
    console.log('Prompt:', prompt);
    console.log('Food Expenses:', foodExpenses);
    console.log('Entertainment Expenses:', entertainmentExpenses);
    console.log('Housing Expenses:', housingExpenses);
    console.log('Transportation Expenses:', transportationExpenses);
  
    // Create the prompt for Gemini AI to suggest new budget categories based on the current spending
    return `
      Based on the following transactions, please provide a budget suggestion:
  
      Transactions:
      ${transactions.map(t => `Transaction ID: ${t.id}, Type: ${t.transactionType}, Amount: $${t.amount}, Description: ${t.description}`).join('\n')}
  
      Total Income: $${income.toFixed(2)}
      Total Expenses: $${expenses.toFixed(2)}
      Food Expenses: $${foodExpenses.toFixed(2)}
      Entertainment Expenses: $${entertainmentExpenses.toFixed(2)}
      Housing Expenses: $${housingExpenses.toFixed(2)}
      Transportation Expenses: $${transportationExpenses.toFixed(2)}
  
      Based on these expenses, please suggest a budget plan using the following guidelines:
  
      - Please suggest new budget amounts for **Food**, **Entertainment**, **Housing**, and **Transportation** based on the current spending.
      - You can suggest an overall budget structure for each category (Food, Entertainment, Housing, Transportation) with suggested amounts based on the **current spending** and your expertise in budget planning.
      - Use <strong> tags for important details like Total Income, Total Expenses, etc.
      - Use <ul><li> tags to list out suggested budget categories.
      - Use <em> for emphasis on important categories, such as food.
      - Ensure that the sum of all budget categories (Food, Entertainment, Housing, Transportation) does not exceed the total expenses or income.
  
      Format the response like this:
      <strong>Suggested Budget Breakdown</strong>
  
      <ul>
        <li><strong>Total Income:</strong> $${income.toFixed(2)}</li>
        <li><strong>Total Expenses:</strong> $${expenses.toFixed(2)}</li>
        <br />
        <li><strong>Suggested Budget:</strong>
          <ul>
            <li><em>Budget for Food:</em> $[amount]</li>
            <li><em>Budget for Entertainment:</em> $[amount]</li>
            <li><em>Budget for Housing:</em> $[amount]</li>
            <li><em>Budget for Transportation:</em> $[amount]</li>
          </ul>
        </li>
      </ul>
      <h4><strong>Explanation</strong></h4>
      [Brief explanation of how the suggested budget amounts were calculated based on the current spending.]
    `;
  }
  // Send the parsed budget to the backend to be saved
  saveBudget(budgetData: any): Observable<Budget> {
    const url = 'https://localhost:8099/api/budgets';
    return this.http.post<Budget>(url, budgetData);
  }

  parseAiGeneratedBudgetResponse(response: string, userId: number): Budget {
    // Regular expressions to extract the budget values from the AI's HTML-like response
    const foodMatch = response.match(/<em>Budget for Food<\/em>:\s*\$(\d+\.\d{2})/);
    const housingMatch = response.match(/<em>Budget for Housing<\/em>:\s*\$(\d+\.\d{2})/);
    const transportationMatch = response.match(/<em>Budget for Transportation<\/em>:\s*\$(\d+\.\d{2})/);
    const entertainmentMatch = response.match(/<em>Budget for Entertainment<\/em>:\s*\$(\d+\.\d{2})/);
    const startDateMatch = response.match(/Start Date: (\d{4}-\d{2}-\d{2})/);
    const endDateMatch = response.match(/End Date: (\d{4}-\d{2}-\d{2})/);

    if (!foodMatch || !housingMatch || !transportationMatch || !entertainmentMatch) {
      throw new Error('Error: Could not extract all required budget values from AI response.');
    }

    if (!startDateMatch || !endDateMatch) {
      throw new Error('Error: Could not extract start and end dates from AI response.');
    }

    // Extract the matched values and parse them into numbers
    const foodBudget = parseFloat(foodMatch[1]);
    const housingBudget = parseFloat(housingMatch[1]);
    const transportationBudget = parseFloat(transportationMatch[1]);
    const entertainmentBudget = parseFloat(entertainmentMatch[1]);
    const startDate = startDateMatch[1];
    const endDate = endDateMatch[1];

    // Return a new Budget instance with the extracted values
    return new Budget(
      userId,
      startDate,
      endDate,
      foodBudget,
      housingBudget,
      transportationBudget,
      entertainmentBudget,
      true // aiGenerated = true
    );
  }
}
