import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, tap, finalize, filter, catchError } from 'rxjs/operators';
import { pipe, concat, of, Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface AssignmentDescUpdate {
  id: number;
  name: string;
}

@Component({
  selector: 'app-assignment-list',
  templateUrl: './assignment-list.component.html',
  styleUrls: ['./assignment-list.component.css']
})
export class AssignmentListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'changeDate', 'changedBy', 'actions',
    'clone', 'delete'];
  dataSource = new MatTableDataSource([]);
  isRefreshing = false;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    public dialog: MatDialog,
    private http: HttpClient) {
  }

  ngOnInit(): void {
    this.refresh(of([])).subscribe();
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  refresh(child: Observable<any>): Observable<any> {
    console.log('refresh');
    this.isRefreshing = true;
    return child.pipe(
      switchMap(_ => this.http.get<any>(`assignment-list`, {})),
      tap(a => {
        this.dataSource = new MatTableDataSource(a);
        this.dataSource.sort = this.sort;
      }),
      finalize(() => this.isRefreshing = false),
      catchError(e => { alert(e.message); return of(`e.message`); })
    );
  }

  openDialog(id: number, name: string): void {
    const obs = this.dialog.open(AssignmentListDialogComponent, {
      width: '60%',
      data: { id, name }
    }).afterClosed().pipe(
      filter(a => a),
      switchMap(a => this.refresh(this.http.post<any>(`assignment-desc-edit`, a))))
      .subscribe();
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

  delete(id: number) {
    this.confirm(this.http.post<any>(`assignment-desc-delete`, { id }),
      'Would you like to delete this assignment?');
  }

  clone(id: number) {
    this.confirm(this.http.post<any>(`assignment-desc-clone`, { id }),
      'Would you like to clone this assignment?');
  }
}

@Component({
  selector: 'app-dialog-candidate-dialog',
  templateUrl: 'assignment-list.dialog.component.html',
})
export class AssignmentListDialogComponent implements OnInit {
  titleForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AssignmentListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AssignmentDescUpdate) { }

  ngOnInit(): void {
    this.titleForm = this.formBuilder.group({
      title: [this.data.name, Validators.required]
    });
  }

  get fval() { return this.titleForm.controls; }

  onFormSubmit() {
    this.submitted = true;
    if (this.titleForm.invalid) {
      return;
    }
    this.dialogRef.close( {...this.data, name: this.fval.title.value });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

