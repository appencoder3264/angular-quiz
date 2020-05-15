import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { switchMap, tap, finalize, catchError, filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { CadidateItem, ExamDesc } from 'src/app/store/quiz.models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConditionalExpr } from '@angular/compiler';
import { ResultComponent } from '../../result/result.component';

interface AsmtKeyValue {
  [name: string]: string;
}


@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.css']
})
export class CandidatesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'first_name', 'last_name', 'email',
    'code', 'taken', 'result', 'assigmnet', 'actions', 'delete'];
  dataSource = new MatTableDataSource([]);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  isRefreshing = false;
  asmtKeyValue: AsmtKeyValue = {};

  constructor(
    private dialog: MatDialog,
    private http: HttpClient) { }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.refresh(of([])).subscribe();
  }

  refresh(child: Observable<any>): Observable<any> {
    console.log('refresh');
    this.isRefreshing = true;
    return child.pipe(
      switchMap(_ => this.http.get<any>(`assignment-list`, {})),
      tap(a => a.forEach(it => this.asmtKeyValue[it.id] = it.name)),
      switchMap(_ => this.http.get<any>(`candidate-list`, {})),
      tap(a => {
        this.dataSource = new MatTableDataSource(a);
        this.dataSource.sort = this.sort;
      }),
      finalize(() => this.isRefreshing = false),
      catchError(e => { alert(e.message); return of(`e.message`); })
    );
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  delete(id: number) {
    this.confirm(this.http.post<any>(`candidate-delete`, { id }),
      'Would you like to delete this candidate?');
  }

  confirm(obs: Observable<any>, title: string) {
    this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Warning',
        message: title
      }
    }).afterClosed().pipe(
      filter(a => a),
      switchMap(_ => this.refresh(obs)),
    ).subscribe();
  }

  openDialog(element: CadidateItem): void {
    if (!element) {
      element = {} as CadidateItem;
    }
    const dialogRef = this.dialog.open(CandidateDialogComponent, {
      width: '100%',
      data: { asmtKeyValue: this.asmtKeyValue, in: element }
    });

    dialogRef.afterClosed().pipe(
      filter(a => a),
      switchMap(a => this.refresh(this.http.post<any>(`candidate-edit`, a))))
      .subscribe();
  }

  openResult(code: string): void {
    this.dialog.open(CandidateResultDialogComponent, {
      width: '100%',
      data: { code }
    });
  }
}

@Component({
  selector: 'app-dialog-candidate-dialog',
  templateUrl: 'candidate.dialog.component.html',
})
export class CandidateDialogComponent implements OnInit {

  candidateForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CandidateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    console.log(this.data);
    this.candidateForm = this.formBuilder.group({
      firstName: [this.data.in.firstName, Validators.required],
      lastName: [this.data.in.lastName, Validators.required],
      email: [this.data.in.email, Validators.email],
      assigmnetId: [this.data.in.assigmnetId, Validators.required],
    });
  }

  get fval() { return this.candidateForm.controls; }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onFormSubmit(): void {
    this.submitted = true;
    if (this.candidateForm.invalid) {
      return;
    }
    this.dialogRef.close({
      id: this.data.in.id,
      firstName: this.fval.firstName.value,
      lastName: this.fval.lastName.value,
      email: this.fval.email.value,
      assigmnetId: this.fval.assigmnetId.value,
    });
  }

}

@Component({
  selector: 'app-dialog-candidate-result-dialog',
  templateUrl: 'candidate-result.dialog.component.html',
})
export class CandidateResultDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CandidateResultDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
