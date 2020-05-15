import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from 'src/app/store/app.state';
import { Store } from '@ngrx/store';
import { SetQuestions } from '../../store/quiz.actions';
import { QuestionItem } from 'src/app/store/quiz.models';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loading = false;
  isError = false;
  code = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<AppState>) { }
  ngOnInit(): void {
  }

  isProd() {
    return environment.production;
  }

  start(): void {
    this.isError = false;
    this.http.post<any>(`quiz`, {code: this.code})
      .subscribe(
        data => {
          console.log(data);
          this.loading = false;
          this.store.dispatch(new SetQuestions(data.name, this.code, data.items ));
          this.router.navigate(['/quiz'], { queryParams: { q: 0 } });
        },
        error => {
          console.log(error);
          this.loading = false;
          this.isError = true;
        });
  }


}
