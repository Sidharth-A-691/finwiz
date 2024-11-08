import { Component, OnInit } from '@angular/core';
import { GoalService } from '../services/goal/goal.service';
import { GoalDto } from '../model/goal.dto';

@Component({
  selector: 'app-goal',
  templateUrl: './goal.component.html',
  styleUrls: ['./goal.component.css']
})
export class GoalComponent implements OnInit {

  user: any;


  goal: GoalDto = {
    goalName: '',
    value: 0,
    description: '',
    durationInMonths: 0,
    startDate: new Date()
  };
  goals: any[] = [];
  goalIdToDelete: number | null = null;

  constructor(private goalService: GoalService) { }

  ngOnInit(): void {
    this.loadGoals();
  }

  onSubmit(): void {
    if (!this.goal.goalName || this.goal.value <= 0 || this.goal.durationInMonths <= 0) {
      alert('All fields are required, and value/duration must be greater than zero!');
      return;
    }

    this.goalService.createGoal(this.goal).subscribe(
      (newGoal) => {
        this.goals.push(newGoal);
        this.resetForm();
      },
      (error) => {
        console.error('Error saving goal:', error);
      }
    );
  }

  loadGoals(): void {
    this.goalService.getAllGoals().subscribe((data: GoalDto[]) => {
      this.goals = data;
  });
}

  confirmDelete(goalId: number): void {
    const confirmDelete = window.confirm('Are you sure you want to delete this goal?');
    if (confirmDelete) {
      this.deleteGoal(goalId);
    }
  }

  deleteGoal(goalId: number): void {
    this.goalService.deleteGoal(goalId).subscribe(() => {
      this.loadGoals(); // Refresh the list of goals
    });
  }

  // Calculate remaining days for each goal
  calculateDaysLeft(goal: GoalDto): number {
    const currentDate = new Date();
    const createdDate = new Date(goal.startDate);
    const endDate = new Date(createdDate.setMonth(createdDate.getMonth() + goal.durationInMonths));
    
    // Calculate the difference in time
    const timeDiff = endDate.getTime() - currentDate.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));  // Convert time to days

    return daysLeft >= 0 ? daysLeft : 0;  // Return 0 if the goal has passed
  }

  resetForm(): void {
    this.goal = {
      goalName: '',
      value: 0,
      description: '',
      durationInMonths: 0,
      startDate: new Date()
    };
  }
}

