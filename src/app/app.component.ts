import { Component } from '@angular/core';
import { AuthenticationService } from './service/authentication-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-quiz';
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService) { }

  get userName(): string {
    return this.authenticationService.currentUserValue?.userName;
  }

  logout(): void {
    this.authenticationService.logout();
    this.router.navigate(['/']);
  }
}
