import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-login',
  standalone: false,
  template: `
    <div class="login-container">
      <div class="login-background">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
      </div>
      
      <app-spinner *ngIf="isLoading"></app-spinner>
      
      <div class="login-card" [@fadeIn]>
        <div class="login-header">
          <div class="brand-logo">
            <div class="logo-icon">
              <i class="fas fa-user-shield"></i>
            </div>
          </div>
          <h2>Welcome Back</h2>
          <p class="subtitle">Enter your credentials to access your account</p>
        </div>
        
        <div *ngIf="errorMessage" class="alert alert-danger">
          <i class="fas fa-exclamation-circle"></i>
          {{ errorMessage }}
        </div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group" [class.focused]="focusedField === 'email'">
            <label for="email">
              <i class="fas fa-envelope"></i>
              Email
            </label>
            <input
              type="email"
              id="email"
              formControlName="email"
              class="form-control"
              [class.is-invalid]="email?.invalid && email?.touched"
              (focus)="focusedField = 'email'"
              (blur)="focusedField = ''"
              placeholder="your.email@example.com"
            >
            <div class="validation-message" *ngIf="email?.errors?.['required'] && email?.touched">
              Email is required
            </div>
            <div class="validation-message" *ngIf="email?.errors?.['email'] && email?.touched">
              Please enter a valid email
            </div>
          </div>

          <div class="form-group" [class.focused]="focusedField === 'password'">
            <label for="password">
              <i class="fas fa-lock"></i>
              Password
            </label>
            <div class="password-input-container">
              <input
                [type]="showPassword ? 'text' : 'password'"
                id="password"
                formControlName="password"
                class="form-control"
                [class.is-invalid]="password?.invalid && password?.touched"
                (focus)="focusedField = 'password'"
                (blur)="focusedField = ''"
                placeholder="••••••••"
              >
              <button type="button" class="toggle-password" (click)="showPassword = !showPassword">
                <i class="fas" [ngClass]="showPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
              </button>
            </div>
            <div class="validation-message" *ngIf="password?.invalid && password?.touched">
              Password is required
            </div>
          </div>

          <div class="form-options">
            <div class="remember-me">
              <input type="checkbox" id="remember" class="custom-checkbox">
              <label for="remember">Remember me</label>
            </div>
            <a href="#" class="forgot-password">Forgot password?</a>
          </div>

          <button type="submit" class="btn-login" [disabled]="loginForm.invalid || isLoading">
            <span class="btn-text">{{ isLoading ? 'Logging in...' : 'Login' }}</span>
            <i class="fas fa-arrow-right"></i>
          </button>

          <div class="separator">
            <span>OR</span>
          </div>

          <div class="social-login">
            <button type="button" class="social-btn google">
              <i class="fab fa-google"></i>
            </button>
            <button type="button" class="social-btn facebook">
              <i class="fab fa-facebook-f"></i>
            </button>
            <button type="button" class="social-btn twitter">
              <i class="fab fa-twitter"></i>
            </button>
          </div>

          <div class="register-prompt">
            <p>Don't have an account? <a routerLink="/register" class="register-link">Register now</a></p>
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrls: [`./login.component.css`],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  showPassword: boolean = false;
  focusedField: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          // Navigation is handled in AuthService
        },
        error: (error) => {
          this.isLoading = false;
          if (error.status === 404) {
            this.errorMessage = 'User not found. Please register first.';
          } else if (error.status === 401) {
            this.errorMessage = 'Invalid email or password.';
          } else {
            this.errorMessage = 'An error occurred. Please try again.';
          }
        }
      });
    }
  }
}