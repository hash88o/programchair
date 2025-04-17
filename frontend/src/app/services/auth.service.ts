import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;
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
      // Only try to get user info if we're not on the register page
      if (!window.location.pathname.includes('/register')) {
        this.getCurrentUserInfo().subscribe();
      }
    }
  }

  register(user: any): Observable<any> {
    console.log('Attempting registration with:', { ...user, password: '***' });
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      tap((response: any) => {
        console.log('Registration successful:', response);
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        console.error('Registration error:', error);
        return this.handleError(error);
      })
    );
  }

  login(credentials: {email: string, password: string}): Observable<any> {
    console.log('Attempting login with:', { ...credentials, password: '***' });
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        console.log('Login successful:', response);
        if (response.token) {
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.authStateSubject.next(true);
          this.currentUserSubject.next(response.user);
          this.router.navigate(['/program-chairs']);
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return this.handleError(error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('user');
    this.authStateSubject.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getCurrentUserInfo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`).pipe(
      tap((user: any) => {
        this.currentUserSubject.next(user);
      }),
      catchError(error => {
        // Only logout if we're not on register or login page
        if (!window.location.pathname.includes('/register') && 
            !window.location.pathname.includes('/login')) {
          this.logout();
        }
        return throwError(() => error);
      })
    );
  }

  isAuthenticated(): boolean {
    // Don't check authentication on register page
    if (window.location.pathname.includes('/register')) {
      return false;
    }
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    console.error('API Error:', error);

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else if (error.status === 0) {
      errorMessage = 'Cannot connect to the server. Please try again later.';
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
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = 'An unexpected error occurred. Please try again.';
      }
    }
    return throwError(() => errorMessage);
  }
}
