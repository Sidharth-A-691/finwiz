export class Budget {  
    userId: number;
    budgetStartDate: string;  // String type for date (ISO format)
    budgetEndDate: string;    // String type for date (ISO format)
    food: number;  // Food budget
    housing: number;  // Housing budget
    transportation: number;  // Transportation budget
    entertainment: number;  // Entertainment budget
    aiGenerated: boolean; //
  
    constructor(
      userId: number,
      budgetStartDate: string,
      budgetEndDate: string,
      food: number,
      housing: number,
      transportation: number,
      entertainment: number,
      aiGenerated: boolean = false  
    
    ) {
      this.userId = userId;
      this.budgetStartDate = budgetStartDate;
      this.budgetEndDate = budgetEndDate;
      this.food = food;
      this.housing = housing;
      this.transportation = transportation;
      this.entertainment = entertainment;
      this.aiGenerated = aiGenerated;
    }
  }
  