import { Routes } from '@angular/router';
import { AuthContentComponent } from './auth-content/auth-content.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginFormComponent },
  { path: 'AuthContent', component: AuthContentComponent, canActivate: [AuthGuard] }
];

