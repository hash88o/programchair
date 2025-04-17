import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { LandingComponent } from './components/landing/landing.component';
import { ProgramChairComponent } from './components/program-chair/program-chair.component';
import { ProgramChairListComponent } from './components/program-chair-list/program-chair-list.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'program-chairs', 
    component: ProgramChairListComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'program-chair/new', 
    component: ProgramChairComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'program-chair/:id/edit', 
    component: ProgramChairComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
