import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { Router, ActivatedRoute } from '@angular/router';
import { QuestionItem } from 'src/app/store/quiz.models';
import { AppState } from 'src/app/store/app.state';
import { Store } from '@ngrx/store';
import { tap, switchMap, first } from 'rxjs/operators';
import { SetAnswer } from 'src/app/store/quiz.actions';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})

export class QuizComponent implements OnInit  {

  questions: QuestionItem[] = [];
  currentItem: QuestionItem;
  questionIndex = 0;
  selectedValue: number;
  title: string;
  code: string;
  errorMessage: string;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>) {
  }

  ngOnInit(): void {
    console.log('ngOnInit start!');
    this.route.queryParams.pipe(
      tap(p => this.questionIndex = +p.q || 0),
      // SwitchMap unsubscribe store$ when queryParams$ emits.
      switchMap(_ => this.store.select(s => s.quiz)),
    ).subscribe(a => {
      this.questions = a.questions;
      this.currentItem = this.questions[ this.questionIndex ];
      this.selectedValue = a.answers[ this.questionIndex ];
      this.title = a.name;
      this.code = a.code;
    });
  }

  isSelected(): boolean {
    return this.selectedValue !== null;
  }

  isLast(): boolean {
    return this.questionIndex + 1 >= this.questions.length;
  }

  next(): void {
    this.store.dispatch(new SetAnswer( this.questionIndex,  this.selectedValue ));

    if (!this.isLast()) {
      this.router.navigate(['/quiz'], { queryParams: { q: this.questionIndex + 1 } });
    } else {
      this.errorMessage = null;
      this.store.select(s => s.quiz).pipe(
        first(),
        switchMap( a => this.http.post<any>(`quiz-submit`, { answers: a.answers, code: a.code })),
      ).subscribe( _ => this.router.navigate(['/result'], { queryParams: { code: this.code }}),
       error => { this.errorMessage = error.message; },
      () => console.log('quiz-submit done.'));
    }
  }

  isFirst(): boolean {
    return this.questionIndex === 0;
  }
  previous(): void {
    this.store.dispatch(new SetAnswer( this.questionIndex,  this.selectedValue ));
    this.router.navigate(['/quiz'], { queryParams: { q: this.questionIndex - 1} });
  }
}
