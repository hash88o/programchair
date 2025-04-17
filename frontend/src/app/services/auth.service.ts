import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_BASE = '/api/auth';
  private authStateSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<any>(null);
  private tokenKey = 'auth_token';
  public authStateChanged = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkInitialAuth();
  }

  private checkInitialAuth() {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this.authStateSubject.next(true);
    }
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.API_BASE}/register`, user).pipe(
      tap(() => {
        this.router.navigate(['/login']);
      })
    );
  }

  login(credentials: {email: string, password: string}): Observable<any> {
    return this.http.post(`${this.API_BASE}/login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.authStateSubject.next(true);
        this.currentUserSubject.next(response.user);
        this.router.navigate(['/program-chairs']);
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('user');
    this.authStateSubject.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): any {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      switch (error.status) {
        case 401:
          errorMessage = 'Invalid email or password';
          break;
        case 404:
          errorMessage = 'Account not found';
          break;
        case 409:
          errorMessage = 'Email already registered';
          break;
        case 422:
          errorMessage = 'Invalid input data';
          break;
        default:
          errorMessage = 'Server error, please try again later';
      }
    }
    return throwError(() => errorMessage);
  }
}
