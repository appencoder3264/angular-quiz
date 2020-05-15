import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { switchMap, finalize, catchError, first, refCount, share, tap, shareReplay } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  @Input() code: string;
  loaded = false;
  errorMessage: string;
  results$: Observable<any>;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.results$ = this.initObj(this.code ? of({ code: this.code }) : this.route.queryParams);
  }

  initObj(o: Observable<any>): Observable<any> {
    return o.pipe(
      switchMap(p => this.http.get<any>(`quiz-result`, { params: { code: p.code } })),
      tap(() => { this.loaded = true; }),
      catchError(e => {
        this.errorMessage = e.message;
        this.loaded = true;
        return of({});
      }),
      shareReplay(),
    );
  }

  pct(results?: number[]) {
    if (!results) {
      return null;
    }
    const ones = results.filter(a => a === 1).length;
    return (100 * ones / results.length).toFixed(2);
  }
}
