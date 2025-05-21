import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Goal } from '../../shared/models/goal.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class GoalsService {
  private apiUrl = environment.apiUrl + '/goals';
  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
  getPublicGoals(): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${this.apiUrl}/public-goals`);
  }

  getPublicGoalById(id: string): Observable<Goal> {
    return this.http.get<Goal>(`${this.apiUrl}/public-goals/${id}`);
  }

  getUserGoals(): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${this.apiUrl}/`, {
      headers: this.getAuthHeaders(),
    });
  }

  addGoal(goal: Goal): Observable<Goal> {
    return this.http.post<Goal>(`${this.apiUrl}/`, goal, {
      headers: this.getAuthHeaders(),
    });
  }

  updateGoal(id: string, goal: Goal): Observable<Goal> {
    const {
      id: _,
      publicId: __,
      ownerId: ___,
      createdAt: ____,
      updatedAt: _____,
      ...sanitizedGoal
    } = goal;

    return this.http.put<Goal>(`${this.apiUrl}/${id}`, sanitizedGoal, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteGoal(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
