import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { QuestionItem, ExamDesc, CadidateItem } from '../store/quiz.models';

const item1: QuestionItem = {
    answer: 0,
    question: 'Your boss asks you to work on a Saturday, but you had plans to go out of town to visit friends. Do you:', choices: [
        { value: 'Tell your boss you have plans and you\'ll work late on Monday.' },
        { value: 'Cancel your plans and go into work.' },
        { value: 'Tell your boss you had a family emergency and go out of town.' },
        ]
};
const item2: QuestionItem = {
    answer: 2,
    question: 'A company you\'ve been with for over five years is going through tough times, and you are asked to take a temporary 20% pay cut. Do you:',
    choices: [
        { value: `Take the pay cut and stick with your job.` },
        { value: `Leave the company and look for another job.` },
        { value: `Attempt to negotiate a smaller pay cut.` }
    ]
};

const E_CAND: CadidateItem[] = [
    {
        id: 1,
        firstName: 'Kimberli',
        lastName: 'Linguard',
        email: 'klinguard0@blog.com',
        taken: 'May 10, 2020',
        result: 91.66,
        assigmnetId: 0,
        code: 'XXSSDS7667676GD'
    },
    {
        id: 2,
        firstName: 'Niels',
        lastName: 'Asbery',
        email: 'nasbery1@hc360.com',
        taken: 'May 10, 2020',
        result: 81.66,
        assigmnetId: 0,
        code: 'DSKDLJSKDKD334'
    }];

const ASSGN_ITEMS: any = { 0: { name: 'Fun quiz', items: [item1, item2] } };
const ASSGN_TMPL: ExamDesc = { id: 0, name: '', changeDate: '12.05.20 14:32', changedBy: 'mock_user' };
const ASSGN_LIST: ExamDesc[] = [{ ...ASSGN_TMPL, id: 0, name: 'Fun quiz', }];

@Injectable()
export class HttpMockInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, params, headers, body } = request;

        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize())
            .pipe(delay(500))
            .pipe(dematerialize());


        function handleRoute() {

            console.log('mock: going to:', url, 'body', body, 'param', params.toString());
            switch (true) {
                case url.endsWith('auth/login') && method === 'POST':
                    return ok({ userName: 'admin', token: 'debug_token' });
                case url.endsWith('assignment') && method === 'GET':
                    const items = ASSGN_ITEMS[params.get('id')];
                    console.log(items);
                    return ok(items);
                case url.endsWith('assignment-list') && method === 'GET':
                    return ok(Object.keys(ASSGN_LIST).map(a => ASSGN_LIST[a]));
                case url.endsWith('assignment-desc-edit') && method === 'POST':
                    if (body.id == null) {
                        const newId = Math.floor(Math.random() * 1000);
                        ASSGN_LIST[newId] = { ...ASSGN_TMPL, name: body.name, id: newId };
                        ASSGN_ITEMS[newId] = { name: body.name, items: [] };
                    } else {
                        ASSGN_LIST[body.id].name = body.name;
                    }
                    return ok();
                case url.endsWith('assignment-desc-clone') && method === 'POST':
                    const id = Math.floor(Math.random() * 1000);
                    ASSGN_LIST[id] = { ...ASSGN_TMPL, id };
                    ASSGN_LIST[id].name = ASSGN_LIST[body.id].name + ' cloned';
                    ASSGN_ITEMS[id] = { name: ASSGN_LIST[id].name, items: ASSGN_ITEMS[body.id].items };
                    return ok();
                case url.endsWith('save-questions') && method === 'POST':
                    ASSGN_ITEMS[body.id] = { ...ASSGN_ITEMS[body.id], items: body.items };
                    return ok();
                case url.endsWith('assignment-desc-delete') && method === 'POST':
                    delete ASSGN_ITEMS[body.id];
                    delete ASSGN_LIST[body.id];
                    return ok();

                // candidate
                case url.endsWith('candidate-list') && method === 'GET':
                    return ok(E_CAND);
                case url.endsWith('candidate-edit') && method === 'POST':
                    if (body.id) {
                        const it = E_CAND.filter(a => a.id === body.id)[0];
                        it.firstName = body.firstName;
                        it.lastName = body.lastName;
                        it.email = body.email;
                        it.assigmnetId = body.assigmnetId;
                    } else {
                        body.id = Math.floor(Math.random() * 1e+3);
                        body.code = '' + Math.floor(Math.random() * 1e+7);
                        E_CAND.push(body);
                    }
                    return ok(E_CAND);
                case url.endsWith('candidate-delete') && method === 'POST':
                    for (const i in E_CAND) {
                        if (E_CAND[i].id === body.id) {
                            E_CAND.splice(+i, 1);
                            break;
                        }
                    }
                    return ok();
                // quiz
                case url.endsWith('quiz') && method === 'POST':
                    const c = E_CAND.filter(a => a.code === body.code);
                    if (c.length === 0) {
                        return error(body.code + ' code not found');
                    }
                    return ok(ASSGN_ITEMS[c[0].assigmnetId]);
                case url.endsWith('quiz-submit') && method === 'POST':
                    return ok();
                case url.endsWith('quiz-result') && method === 'GET':
                    return ok({ name: 'Quiz name', results: [0, 0, 1, 1, 1, 1, 0, 0, 1] });
                default:
                    // pass through any requests not handled above
                    console.log('not mocked');
                    return next.handle(request);
            }
        }
        function ok(httpBody?) {
            return of(new HttpResponse({ status: 200, body: httpBody }));
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function error(message) {
            return throwError({ error: { message } });
        }
    }
}

export const httpMockProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpMockInterceptor,
    multi: true
};
