import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { ResultComponent } from './components/result/result.component';
import { AssignmentListComponent } from './components/admin/assignment-list/assignment-list.component';
import { LoginComponent } from './components/admin/login/login.component';
import { CandidatesComponent } from './components/admin/candidates/candidates.component';
import { AuthGuard } from './service/auth-guard';
import { AssignmentComponent } from './components/admin/assignment/assignment.component';
import { ChangePasswordComponent } from './components/admin/change-password/change-password.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'quiz', component: QuizComponent },
  { path: 'result', component: ResultComponent },

  { path: 'login', component: LoginComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'admin', pathMatch: 'full', redirectTo: 'candidates' },
  { path: 'assignment-list', component: AssignmentListComponent, canActivate: [AuthGuard] },
  { path: 'candidates', component: CandidatesComponent, canActivate: [AuthGuard] },
  { path: 'assignment', component: AssignmentComponent, canActivate: [AuthGuard],  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
