import { BrowserModule } from '@angular/platform-browser';
import { AngularMaterialModule } from './angular-material.module';

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { StoreModule } from '@ngrx/store';
import { reducer } from './store/quiz.reducer';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { ResultComponent } from './components/result/result.component';
import { LoginComponent } from './components/admin/login/login.component';
import { CandidatesComponent, CandidateDialogComponent } from './components/admin/candidates/candidates.component';
import { AssignmentListComponent, AssignmentListDialogComponent } from './components/admin/assignment-list/assignment-list.component';
import { AssignmentComponent } from './components/admin/assignment/assignment.component';
import { httpMockProvider } from './service/http-mock-interceptor';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { CandidateResultDialogComponent } from './components/admin/candidates/candidates.component';
import { ChangePasswordComponent } from './components/admin/change-password/change-password.component';
import { httpOAuth2Provider } from './service/http-oauth2-interceptor';
import { AuthenticationService } from './service/authentication-service';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    QuizComponent,
    ResultComponent,
    LoginComponent,
    CandidatesComponent,
    AssignmentListComponent,
    AssignmentComponent,
    CandidateDialogComponent,
    AssignmentListDialogComponent,
    ConfirmDialogComponent,
    CandidateResultDialogComponent,
    ChangePasswordComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot({
      quiz: reducer
    }),
    FlexLayoutModule,
    AngularMaterialModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  // providers: [httpMockProvider],
  providers: [environment.httpMock ? httpMockProvider : httpOAuth2Provider],
  bootstrap: [AppComponent]
})
export class AppModule { }
