import { Component, OnInit } from '@angular/core';
import { QuestionItem } from 'src/app/store/quiz.models';
import { Router, ActivatedRoute } from '@angular/router';
import { AppState } from 'src/app/store/app.state';
import { Store } from '@ngrx/store';
import { first, take, pluck } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-exam',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css']
})
export class AssignmentComponent implements OnInit {
  isSaving = false;
  questions: QuestionItem[] = [];
  examId: number =  null;
  pageTitile: null;

  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      first(),
    ).subscribe(p => this.load(p.id));
  }

  load(id: number) {
    this.examId = id;
    const param: any = { id };
    this.http.get<any>(`assignment`, { params: param })
      .subscribe(data => {
        this.pageTitile = data.name;
        this.questions = data.items.map(a => {
          return { ...a, answer: a.answer || 0 };
        });
      },
        error => this.pageTitile = error.message);
  }

  checkAnswer(nb: number, del: boolean) {
    const q = this.questions[nb];
    if (!q.answer) {
      q.answer = 0;
    }
    if (del && q.answer >= q.choices.length - 1) {
      q.answer = 0;
    }
  }

  addChoice(id: number) {
    this.checkAnswer(id, false);
    const choices = this.questions[id].choices;
    choices.push({ value: '' });
  }

  moveQuestion(nb: number, inc: number) {
    const it = this.questions[nb];
    this.questions[nb] = this.questions[nb + inc];
    this.questions[nb + inc] = it;
  }
  deleteQuestion(nb: number) {
    this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Warning',
        message: 'Would you like to delete this question?'
      }
    }).afterClosed().subscribe(r => r ? this.questions.splice(nb, 1) : () => { });
  }

  addQuestion() {
    this.questions.push({ question: '', choices: [], answer: 0 });
  }

  saveQuestions() {
    this.isSaving = true;
    this.http.post<any>(`save-questions`, {id: this.examId, items: this.questions})
      .subscribe(() => {
        this.isSaving = false;
        this.router.navigate(['/assignment-list']);
      },
        error => {
          this.isSaving = false;
          alert(error.message);
        });
  }
  removeChoice(nb: number) {

    const choices = this.questions[nb].choices;
    const fn = () => {
      this.checkAnswer(nb, true);
      choices.splice(-1, 1);
    };
    if (choices[choices.length - 1].value.trim().length > 0) {
      this.dialog.open(ConfirmDialogComponent, {
        maxWidth: '400px',
        data: {
          title: 'Warning',
          message: 'Would you like to delete last element?'
        }
      }).afterClosed().subscribe(r => r ? fn() : () => { });
    } else {
      fn();
    }
  }
}
