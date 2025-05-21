import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GoalsService } from '../core/services/goals.service';
import { Goal } from '../shared/models/goal.model';
import { GoalListComponent } from './goal-list/goal-list.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, GoalListComponent],
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  goals: Goal[] = [];
  isLoading = true;
  error: string | null = null;
  @ViewChild(GoalListComponent) goalListComponent!: GoalListComponent;

  constructor(private goalService: GoalsService) {}

  ngOnInit(): void {
    this.fetchGoals();
  }

  fetchGoals(): void {
    this.isLoading = true;
    this.goalService.getUserGoals().subscribe({
      next: (goals) => {
        this.goals = this.sortGoals(goals);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load goals';
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  sortGoals(goals: Goal[]): Goal[] {
    const sortRecursive = (items: Goal[]): void => {
      items.sort((a, b) => a.order - b.order);
      items.forEach((goal) => {
        if (goal.children && goal.children.length > 0) {
          sortRecursive(goal.children);
        }
      });
    };

    // Sort the top-level goals and their nested children
    sortRecursive(goals);
    return goals;
  }

  handleRefresh(): void {
    this.fetchGoals();
  }

  onAddGoal() {
    this.goalListComponent.openGoalForm();
  }
}
