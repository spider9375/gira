import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/core/components/login/login.component';
import { ProjectsModule } from './modules/projects/projects.module';
import { RegisterComponent } from './modules/core/components/register/register.component';
import { DashboardComponent } from './modules/core/components/dashboard/dashboard.component';
import { LoggedInGuard } from './modules/core/guards/logged-in.guard';
import { UsersModule } from './modules/users/users.module';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'projects',
    loadChildren: () => ProjectsModule,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'users',
    loadChildren: () => UsersModule,
    canActivate: [LoggedInGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
