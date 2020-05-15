import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import {QuestionItem} from './quiz.models';

export const SET_QUESTIONS      = '[QUIZ] SetQuestions';
export const SET_ANSWER         = '[QUIZ] SetAnswer';

export class SetQuestions implements Action {
    readonly type = SET_QUESTIONS;

    constructor(public name: string, public code: string, public payload: QuestionItem[]) {}
}

export class SetAnswer implements Action {
    readonly type = SET_ANSWER;

    constructor(public index: number, public answer: number) {}
}
export type Actions = SetQuestions | SetAnswer;
