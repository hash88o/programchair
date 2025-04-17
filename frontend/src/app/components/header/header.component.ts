import { Component, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-header',
  standalone: false,
  template: `
    <nav class="navbar" [class.scrolled]="scrolled" [@headerAnimation]="scrollState">
      <div class="container">
        <div class="nav-brand" routerLink="/">
          <div class="brand-logo">
            <i class="fas fa-users-cog"></i>
          </div>
          <span class="brand-text">Program Chair <span class="highlight">Management</span></span>
        </div>
        
        <div class="nav-links">
          <ng-container *ngIf="!authService.isAuthenticated()">
            <a routerLink="/login" routerLinkActive="active" class="nav-link">
              <i class="fas fa-sign-in-alt"></i>
              <span>Login</span>
            </a>
            <a routerLink="/register" routerLinkActive="active" class="nav-link">
              <i class="fas fa-user-plus"></i>
              <span>Register</span>
            </a>
            <a routerLink="/about" routerLinkActive="active" class="nav-link desktop-only">
              <i class="fas fa-info-circle"></i>
              <span>About</span>
            </a>
          </ng-container>
          
          <ng-container *ngIf="authService.isAuthenticated()">
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-link desktop-only">
              <i class="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </a>
            <a routerLink="/program-chairs" routerLinkActive="active" class="nav-link">
              <i class="fas fa-users"></i>
              <span>Program Chairs</span>
            </a>
            <a routerLink="/conferences" routerLinkActive="active" class="nav-link desktop-only">
              <i class="fas fa-calendar-alt"></i>
              <span>Conferences</span>
            </a>
            <div class="user-menu" (click)="toggleDropdown($event)">
              <div class="user-avatar">
                <i class="fas fa-user"></i>
              </div>
              <span class="username desktop-only">{{ userName }}</span>
              <i class="fas fa-chevron-down desktop-only"></i>
              
              <div class="dropdown-menu" *ngIf="dropdownOpen">
                <a routerLink="/profile" class="dropdown-item">
                  <i class="fas fa-user-circle"></i> Profile
                </a>
                <a routerLink="/settings" class="dropdown-item">
                  <i class="fas fa-cog"></i> Settings
                </a>
                <div class="dropdown-divider"></div>
                <button (click)="logout()" class="dropdown-item logout-item">
                  <i class="fas fa-sign-out-alt"></i> Logout
                </button>
              </div>
            </div>
          </ng-container>
        </div>
        
        <div class="mobile-menu-toggle" (click)="toggleMobileMenu()">
          <i class="fas" [ngClass]="mobileMenuOpen ? 'fa-times' : 'fa-bars'"></i>
        </div>
      </div>
      
      <!-- Mobile Menu -->
      <div class="mobile-menu" [class.open]="mobileMenuOpen">
        <ng-container *ngIf="!authService.isAuthenticated()">
          <a routerLink="/login" routerLinkActive="active" class="mobile-link" (click)="closeMobileMenu()">
            <i class="fas fa-sign-in-alt"></i> Login
          </a>
          <a routerLink="/register" routerLinkActive="active" class="mobile-link" (click)="closeMobileMenu()">
            <i class="fas fa-user-plus"></i> Register
          </a>
          <a routerLink="/about" routerLinkActive="active" class="mobile-link" (click)="closeMobileMenu()">
            <i class="fas fa-info-circle"></i> About
          </a>
        </ng-container>
        
        <ng-container *ngIf="authService.isAuthenticated()">
          <div class="mobile-user-info">
            <div class="mobile-avatar">
              <i class="fas fa-user"></i>
            </div>
            <span class="mobile-username">{{ userName }}</span>
          </div>
          <a routerLink="/dashboard" routerLinkActive="active" class="mobile-link" (click)="closeMobileMenu()">
            <i class="fas fa-tachometer-alt"></i> Dashboard
          </a>
          <a routerLink="/program-chairs" routerLinkActive="active" class="mobile-link" (click)="closeMobileMenu()">
            <i class="fas fa-users"></i> Program Chairs
          </a>
          <a routerLink="/conferences" routerLinkActive="active" class="mobile-link" (click)="closeMobileMenu()">
            <i class="fas fa-calendar-alt"></i> Conferences
          </a>
          <a routerLink="/profile" routerLinkActive="active" class="mobile-link" (click)="closeMobileMenu()">
            <i class="fas fa-user-circle"></i> Profile
          </a>
          <a routerLink="/settings" routerLinkActive="active" class="mobile-link" (click)="closeMobileMenu()">
            <i class="fas fa-cog"></i> Settings
          </a>
          <button (click)="logout(); closeMobileMenu()" class="mobile-logout">
            <i class="fas fa-sign-out-alt"></i> Logout
          </button>
        </ng-container>
      </div>
    </nav>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
    
    :host {
      font-family: 'Poppins', sans-serif;
      display: block;
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    
    .navbar {
      display: flex;
      flex-direction: column;
      background: linear-gradient(135deg, #2b5876 0%, #4e4376 100%);
      color: white;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
    }
    
    .navbar.scrolled {
      padding: 0.6rem 0;
      background: rgba(43, 88, 118, 0.95);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }
    
    .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      transition: transform 0.3s ease;
    }
    
    .nav-brand:hover {
      transform: translateY(-2px);
    }
    
    .brand-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: linear-gradient(45deg, #11998e, #38ef7d);
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(17, 153, 142, 0.4);
    }
    
    .brand-logo i {
      font-size: 18px;
      color: white;
    }
    
    .brand-text {
      font-size: 1.3rem;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    
    .highlight {
      background: linear-gradient(to right, #f6d365, #fda085);
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
    }
    
    .nav-links {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .nav-link {
      display: flex;
      align-items: center;
      gap: 8px;
      color: white;
      text-decoration: none;
      padding: 0.6rem 1rem;
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    
    .nav-link::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.1);
      transform: scaleX(0);
      transform-origin: right;
      transition: transform 0.3s ease;
      border-radius: 8px;
      z-index: -1;
    }
    
    .nav-link:hover::before {
      transform: scaleX(1);
      transform-origin: left;
    }
    
    .nav-link.active {
      background: rgba(255, 255, 255, 0.2);
    }
    
    .nav-link.active::before {
      transform: scaleX(1);
    }
    
    .nav-link i {
      font-size: 16px;
    }
    
    .user-menu {
      position: relative;
      z-index: 1001;
    }
    
    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      width: 220px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      padding: 10px 0;
      z-index: 1002;
    }
    
    .user-avatar {
      width: 36px;
      height: 36px;
      background: linear-gradient(45deg, #fa709a, #fee140);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 3px 10px rgba(250, 112, 154, 0.3);
    }
    
    .user-avatar i {
      font-size: 16px;
      color: white;
    }
    
    .username {
      font-weight: 500;
      margin: 0 5px;
    }
    
    .dropdown-item {
      pointer-events: all;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 20px;
      color: #333;
      text-decoration: none;
      transition: background-color 0.3s;
      font-size: 14px;
    }
    
    .dropdown-item:hover {
      background-color: #f5f7fa;
    }
    
    .dropdown-divider {
      height: 1px;
      background: #eee;
      margin: 8px 0;
    }
    
    .logout-item {
      pointer-events: all;
      cursor: pointer;
      color: #dc3545;
      background: none;
      border: none;
      width: 100%;
      text-align: left;
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-weight: 500;
    }
    
    .logout-item:hover {
      background-color: rgba(220, 53, 69, 0.1);
    }
    
    .mobile-menu-toggle {
      display: none;
      cursor: pointer;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.1);
      transition: background-color 0.3s;
    }
    
    .mobile-menu-toggle:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    
    .mobile-menu-toggle i {
      font-size: 18px;
    }
    
    .mobile-menu {
      display: none;
      flex-direction: column;
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.5s ease;
      background: rgba(43, 88, 118, 0.95);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
    
    .mobile-menu.open {
      max-height: 500px;
    }
    
    .mobile-user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 15px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .mobile-avatar {
      width: 40px;
      height: 40px;
      background: linear-gradient(45deg, #fa709a, #fee140);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .mobile-username {
      font-weight: 500;
      font-size: 16px;
    }
    
    .mobile-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 15px 20px;
      color: white;
      text-decoration: none;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      transition: background-color 0.3s;
    }
    
    .mobile-link:hover, .mobile-link.active {
      background: rgba(255, 255, 255, 0.1);
    }
    
    .mobile-link i {
      width: 20px;
      text-align: center;
    }
    
    .mobile-logout {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 15px 20px;
      background: none;
      border: none;
      color: #ffa5a5;
      font-family: 'Poppins', sans-serif;
      font-size: 16px;
      cursor: pointer;
      width: 100%;
      text-align: left;
    }
    
    .mobile-logout:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    
    @media (max-width: 992px) {
      .desktop-only {
        display: none;
      }
      
      .mobile-menu-toggle {
        display: flex;
      }
      
      .mobile-menu {
        display: flex;
      }
      
      .nav-brand {
        flex: 1;
      }
      
      .brand-text {
        font-size: 1.1rem;
      }
    }
    
    @media (max-width: 576px) {
      .container {
        padding: 0.8rem 1rem;
      }
      
      .brand-logo {
        width: 35px;
        height: 35px;
      }
      
      .brand-text {
        font-size: 1rem;
      }
      
      .nav-link {
        padding: 0.5rem 0.8rem;
      }
      
      .nav-link span {
        display: none;
      }
    }
  `],
  animations: [
    trigger('headerAnimation', [
      state('top', style({
        backgroundColor: 'transparent',
        boxShadow: 'none'
      })),
      state('scrolled', style({
        backgroundColor: 'rgba(43, 88, 118, 0.95)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
      })),
      transition('top => scrolled', animate('300ms ease-in')),
      transition('scrolled => top', animate('300ms ease-out'))
    ])
  ]
})
export class HeaderComponent {
  scrolled = false;
  scrollState = 'top';
  dropdownOpen = false;
  mobileMenuOpen = false;
  userName = '';

  constructor(
    public authService: AuthService,
    private router: Router,
    private elementRef: ElementRef
  ) {
    this.updateUserName();
    this.authService.authStateChanged.subscribe(() => {
      this.updateUserName();
    });
  }

  private updateUserName() {
    if (window.location.pathname.includes('/register')) {
      this.userName = '';
      return;
    }

    this.authService.getCurrentUserInfo().subscribe(
      user => {
        this.userName = user ? user.name : '';
      },
      error => {
        console.error('Error fetching user info:', error);
        this.userName = '';
      }
    );
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (scrollPosition > 50) {
      this.scrolled = true;
      this.scrollState = 'scrolled';
    } else {
      this.scrolled = false;
      this.scrollState = 'top';
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.querySelector('.user-menu')?.contains(event.target as Node)) {
      this.dropdownOpen = false;
    }
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  logout(): void {
    this.dropdownOpen = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}