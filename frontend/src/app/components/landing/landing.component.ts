import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-landing',
  template: `
    <div class="landing-container">
      <div class="hero-section" [@fadeIn]>
        <div class="hero-content">
          <h1>Program Chair <span class="highlight">Management System</span></h1>
          <p class="subtitle">Streamline your conference management process with our powerful tools</p>
          <div class="cta-buttons">
            <button class="btn-primary" (click)="router.navigate(['/login'])">
              <i class="fas fa-sign-in-alt"></i> Login
            </button>
            <button class="btn-secondary" (click)="router.navigate(['/register'])">
              <i class="fas fa-user-plus"></i> Register
            </button>
          </div>
        </div>
        <div class="hero-image">
          <div class="abstract-shape shape-1"></div>
          <div class="abstract-shape shape-2"></div>
          <div class="abstract-shape shape-3"></div>
        </div>
      </div>
      
      <div class="section-title" [@fadeIn]>
        <h2>Key Features</h2>
        <div class="underline"></div>
      </div>
      
      <div class="features-section" [@staggerIn]>
        <div class="feature-card" *ngFor="let feature of features; let i = index" [@cardAnimation]="i">
          <div class="feature-icon">
            <i [class]="feature.icon"></i>
          </div>
          <h3>{{feature.title}}</h3>
          <p>{{feature.description}}</p>
          <div class="feature-action">
            <a href="#">Learn more</a>
          </div>
        </div>
      </div>
      
      <div class="testimonial-section" [@fadeIn]>
        <div class="testimonial-container">
          <div class="quote-mark">"</div>
          <p class="testimonial-text">This system has completely transformed how we manage our conference chairs and organizing committees.</p>
          <div class="testimonial-author">
            <div class="author-avatar"></div>
            <div class="author-details">
              <h4>Dr. Jane Smith</h4>
              <p>Conference Director, Tech Summit 2025</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="cta-section" [@fadeIn]>
        <h2>Ready to get started?</h2>
        <p>Join thousands of conference organizers simplifying their management process</p>
        <button class="btn-cta" (click)="router.navigate(['/register'])">Start Free Trial</button>
      </div>
    </div>
  `,
  styleUrls: [`./landing.component.css`],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.5s {{delay}}s ease-out', 
          style({ opacity: 1, transform: 'translateY(0)' })),
      ], { params: { delay: 0 }})
    ])
  ],
  standalone: false
})
export class LandingComponent {
  features = [
    { 
      title: 'Manage Program Chairs', 
      description: 'Easily add, update, and track program chair information with intuitive interfaces and powerful search capabilities.',
      icon: 'fas fa-users'
    },
    { 
      title: 'Conference Management', 
      description: 'Organize conferences and assign chairs efficiently with our drag-and-drop interface and automated scheduling tools.',
      icon: 'fas fa-calendar-alt'
    },
    { 
      title: 'Secure Access', 
      description: 'Protected data with state-of-the-art user authentication and role-based permissions system.',
      icon: 'fas fa-shield-alt'
    }
  ];

  constructor(public router: Router) {}
}