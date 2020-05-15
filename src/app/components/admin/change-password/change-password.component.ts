import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { finalize, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication-service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  passwordForm: FormGroup;
  loading = false;
  submitted = false;
  pwdError = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    const sameValidationFn = (control: FormGroup): Observable<ValidationErrors | null> => {
      const p1 = this.fval.newPassword1.value;
      const p2 = this.fval.newPassword2.value;
      return of(p1 === p2 ? null : { notMatch: true });
    };
    this.passwordForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword1: ['', Validators.required],
      newPassword2: ['', Validators.required, sameValidationFn]
    });
  }

  get fval() { return this.passwordForm.controls; }
  l(s: any) {
    return JSON.stringify(s);
  }
  onFormSubmit() {
    this.submitted = true;
    if (this.passwordForm.invalid) {
      return;
    }
    this.loading = true;
    this.pwdError = false;
    this.http.post<any>(`password-change`,
      {
        userName: this.authenticationService.currentUserValue.userName,
        oldPassword: this.fval.oldPassword.value,
        newPassword: this.fval.newPassword1.value
      }).pipe(
        tap( _ =>  {
          alert('Your password has been updated');
          this.router.navigate(['/']);
        }),
        finalize(() => {
          this.loading = false;
          this.submitted = false;
          this.passwordForm.reset();
        }),
        catchError(e => {  this.pwdError = true; return of({}); })
      ).subscribe();
  }
}
