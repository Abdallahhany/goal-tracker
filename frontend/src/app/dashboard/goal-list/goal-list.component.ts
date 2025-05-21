import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Goal } from '../../shared/models/goal.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { GoalsService } from '../../core/services/goals.service';

@Component({
  selector: 'app-goal-list',
  imports: [CommonModule, RouterModule, FormsModule, DragDropModule],
  templateUrl: './goal-list.component.html',
  styleUrl: './goal-list.component.css',
})
export class GoalListComponent {
  @Input() goals: Goal[] = [];
  editingGoal: Goal | null = null;
  currentParentId: string | null = null;
  showGoalForm = false;
  goalForm: Partial<Goal> = {};
  @Output() addGoalClicked = new EventEmitter<void>();


  constructor(private goalsService: GoalsService) {}

  drop(event: CdkDragDrop<Goal[]>, goalsArray: Goal[]) {
    if (event.previousIndex === event.currentIndex) return;

    moveItemInArray(goalsArray, event.previousIndex, event.currentIndex);

    // Update order property in all affected goals after reorder
    goalsArray.forEach((goal, index) => (goal.order = index));

    // Call service to update all reordered goals
    goalsArray.forEach((goal) => {
      // remove unnecessary properties before sending to the backend (children)
      const { children, ...sanitizedGoal } = goal;

      this.goalsService.updateGoal(goal.id!, sanitizedGoal).subscribe({
        next: () => {
          // optionally show success or refresh UI
        },
        error: (err) => {
          console.error('Failed to update goal order', err);
        },
      });
    });
  }
  toggleCompleted(goal: Goal) {
    const updatedGoal = { ...goal, completed: !goal.completed };
    // remove unnecessary properties before sending to the backend (children)
    const { children, ...sanitizedGoal } = updatedGoal;
    // send the sanitized goal to the backend
    this.goalsService.updateGoal(goal.id!, sanitizedGoal).subscribe({
      next: () => {
        goal.completed = updatedGoal.completed;
      },
      error: (err) => console.error('Error toggling completed', err),
    });
  }

  toggleVisibility(goal: Goal) {
    const updatedGoal = { ...goal, isPublic: !goal.isPublic };
    // remove unnecessary properties before sending to the backend (children)
    const { children, ...sanitizedGoal } = updatedGoal;
    this.goalsService.updateGoal(goal.id!, sanitizedGoal).subscribe({
      next: () => {
        goal.isPublic = updatedGoal.isPublic;
      },
      error: (err) => console.error('Error toggling visibility', err),
    });
  }

  deleteGoal(goal: Goal) {
    if (!confirm(`Are you sure you want to delete "${goal.title}"?`)) {
      return;
    }
    this.goalsService.deleteGoal(goal.id!).subscribe({
      next: () => {
        this.removeGoalFromList(goal, this.goals);
      },
      error: (err) => console.error('Delete failed', err),
    });
  }

  // Recursive helper to remove goal from nested lists
  removeGoalFromList(goal: Goal, goalsList: Goal[]) {
    const index = goalsList.findIndex((g) => g.id === goal.id);
    if (index !== -1) {
      goalsList.splice(index, 1);
      return true;
    }
    // Recursively check children lists
    for (const g of goalsList) {
      if (g.children && this.removeGoalFromList(goal, g.children)) {
        return true;
      }
    }
    return false;
  }
  openGoalForm(goal?: Goal, isEdit: boolean = false) {
    if (isEdit && goal) {
      this.editingGoal = { ...goal };
      this.goalForm = { ...goal };
      this.currentParentId = goal.parentId || null;
    } else if (goal) {
      // Adding subgoal
      this.editingGoal = null;
      this.currentParentId = goal.id!;
      this.goalForm = {
        title: '',
        description: '',
        deadline: new Date(),
        isPublic: false,
        completed: false,
        order: 0,
      };
    } else {
      // Adding new top-level goal
      this.editingGoal = null;
      this.currentParentId = null;
      this.goalForm = {
        title: '',
        description: '',
        deadline: new Date(),
        isPublic: false,
        completed: false,
        order: 0,
      };
    }
    this.showGoalForm = true;
  }

  submitGoalForm() {
    if (this.editingGoal) {
      // Update existing goal
      const updatedGoal: Goal = {
        ...this.editingGoal,
        ...this.goalForm,
      };
      const { children, ...sanitizedGoal } = updatedGoal;
      this.goalsService
        .updateGoal(this.editingGoal.id!, sanitizedGoal)
        .subscribe({
          next: (res) => {
            this.updateGoalInList(res, this.goals);
            this.showGoalForm = false;
          },
          error: (err) => console.error(err),
        });
    } else {
      // Create new goal or subgoal
      const newGoal: Goal = {
        title: this.goalForm.title as string,
        description: this.goalForm.description as string,
        deadline: this.goalForm.deadline as Date,
        isPublic: this.goalForm.isPublic as boolean,
        order: 0,
        parentId: this.currentParentId,
      };
      this.goalsService.addGoal(newGoal).subscribe({
        next: (res) => {
          if (res.parentId) {
            // Add to parent's children
            const parent = this.findGoalById(res.parentId, this.goals);
            if (parent) {
              parent.children = parent.children || [];
              parent.children.push(res);
            }
          } else {
            // Add to root list
            this.goals.push(res);
          }
          this.showGoalForm = false;
        },
        error: (err) => console.error(err),
      });
    }
  }

  cancelGoalForm() {
    this.showGoalForm = false;
    this.editingGoal = null;
    this.goalForm = {};
    this.currentParentId = null;
  }

  // Helper to update a goal in the nested list
  updateGoalInList(updatedGoal: Goal, goalsList: Goal[]) {
    for (let i = 0; i < goalsList.length; i++) {
      if (goalsList[i].id === updatedGoal.id) {
        goalsList[i] = updatedGoal;
        return true;
      }
      if (
        goalsList[i].children &&
        this.updateGoalInList(updatedGoal, goalsList[i].children!)
      ) {
        return true;
      }
    }
    return false;
  }

  // Helper to find goal by ID recursively
  findGoalById(id: string, goalsList: Goal[]): Goal | null {
    for (const goal of goalsList) {
      if (goal.id === id) return goal;
      if (goal.children) {
        const found = this.findGoalById(id, goal.children);
        if (found) return found;
      }
    }
    return null;
  }

  emitAddGoalEvent() {
    this.addGoalClicked.emit();
  }
}
