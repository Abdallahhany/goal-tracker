import { Component, OnInit } from '@angular/core';
import { GoalsService } from '../core/services/goals.service';
import { Goal } from '../shared/models/goal.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-public-goals',
  imports: [CommonModule, RouterModule],
  standalone: true,
  templateUrl: './public-goals.component.html',
  styleUrl: './public-goals.component.css'
})
export class PublicGoalsComponent implements OnInit {
publicGoals: Goal[] = [];
  loading = true;

  constructor(private goalsService: GoalsService) {}

  ngOnInit(): void {
    this.goalsService.getPublicGoals().subscribe({
      next: (goals) => {
        console.log(goals);
        
        this.publicGoals = goals;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
