import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize, catchError } from 'rxjs/operators';
import { AuthenticationService } from './authentication-service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';



@Injectable({ providedIn: 'root' })
export class HttpOAuth2Interceptor implements HttpInterceptor {

    constructor(
        private authenticationService: AuthenticationService,
        private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, params, headers, body } = request;
        const token = this.authenticationService.currentUserValue?.token || '';

        return of(null)
            .pipe(mergeMap(handleRoute), catchError(e => {
                if (e.status === 401) {
                    this.authenticationService.logout();
                    this.router.navigate(['/']);
                }
                return of(e);
            }))
            .pipe(materialize())
            .pipe(dematerialize());


        function handleRoute() {
            console.log(`going to  ${url}`);

            return next.handle(request.clone({
                url: environment.apiUrl + request.url,
                headers: new HttpHeaders({ Authorization: token }),
            }));
        }
    }
}

export const httpOAuth2Provider = {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpOAuth2Interceptor,
    multi: true,
    deps: [AuthenticationService, Router]
};
