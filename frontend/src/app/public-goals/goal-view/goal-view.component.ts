import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GoalsService } from '../../core/services/goals.service';
import { Goal } from '../../shared/models/goal.model';


@Component({
  selector: 'app-goal-view',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './goal-view.component.html',
  styleUrl: './goal-view.component.css'
})
export class GoalViewComponent implements OnInit {
  goal: Goal | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private goalsService: GoalsService
  ) {}

  ngOnInit(): void {
    const publicId = this.route.snapshot.paramMap.get('id');    
    if (publicId) {
      this.goalsService.getPublicGoalById(publicId).subscribe({
        next: (goal) => {
          console.log(goal);
          
          this.goal = goal;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
    }
  }
}
