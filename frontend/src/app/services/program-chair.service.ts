import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ProgramChair } from '../models/program-chair.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProgramChairService {
  private apiUrl = `${environment.apiUrl}/api`;
  private programChairsSubject = new BehaviorSubject<ProgramChair[]>([]);

  constructor(private http: HttpClient) {
    // Load chairs when service is initialized
    this.loadProgramChairs();
  }

  loadProgramChairs(): void {
    this.http.get<ProgramChair[]>(`${this.apiUrl}/program-chairs`).subscribe({
      next: (chairs) => {
        this.programChairsSubject.next(chairs);
      },
      error: (error) => {
        console.error('Error loading program chairs:', error);
        this.programChairsSubject.next([]);
      }
    });
  }

  getProgramChairs(): Observable<ProgramChair[]> {
    return this.programChairsSubject.asObservable();
  }

  getProgramChairById(id: number): Observable<ProgramChair> {
    return this.http.get<ProgramChair>(`${this.apiUrl}/program-chair/${id}`);
  }

  createProgramChair(chair: Omit<ProgramChair, 'chair_id'>): Observable<ProgramChair> {
    return this.http.post<ProgramChair>(`${this.apiUrl}/program-chair`, chair).pipe(
      tap((newChair) => {
        const currentChairs = this.programChairsSubject.value;
        this.programChairsSubject.next([...currentChairs, newChair]);
      })
    );
  }

  updateProgramChair(id: number, chair: Partial<ProgramChair>): Observable<ProgramChair> {
    return this.http.put<ProgramChair>(`${this.apiUrl}/program-chair/${id}`, chair).pipe(
      tap((updatedChair) => {
        const currentChairs = this.programChairsSubject.value;
        const index = currentChairs.findIndex(c => c.chair_id === id);
        if (index !== -1) {
          currentChairs[index] = updatedChair;
          this.programChairsSubject.next([...currentChairs]);
        }
      })
    );
  }

  deleteProgramChair(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/program-chair/${id}`).pipe(
      tap(() => {
        const currentChairs = this.programChairsSubject.value;
        this.programChairsSubject.next(
          currentChairs.filter(chair => chair.chair_id !== id)
        );
      })
    );
  }
}
