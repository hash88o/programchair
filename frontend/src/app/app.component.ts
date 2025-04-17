import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .main-content {
      flex: 1;
      padding: 2rem;
      max-width: 1200px;
      margin: 80px auto 0;
      width: 100%;
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 1rem;
        margin-top: 60px;
      }
    }
  `],
  standalone: false
})
export class AppComponent {
  title = 'Program Chair Management';
}
