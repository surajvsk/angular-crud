import { Routes } from '@angular/router';
import { authGuard } from './auth-guard';
import { RegisterComponent } from './register/register';
import { ForgotPassword } from './forgotpassword/forgotpassword.component';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { CategoryComponent } from './category/category';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPassword },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  { path: 'category', component: CategoryComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }  // fallback route
];
