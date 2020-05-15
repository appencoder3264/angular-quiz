import { Action } from '@ngrx/store';
import { QuizModel } from './quiz.models';
import * as QuizActions from './quiz.actions';

const initialState: QuizModel = {
    name: null,
    questions: [],
    answers: [],
    code: null
};

export function reducer(state: QuizModel = initialState, action: QuizActions.Actions) {
    switch (action.type) {
        case QuizActions.SET_QUESTIONS:
            return { ...state, questions: action.payload, name: action.name,
                 code: action.code, answers: action.payload.map(_ => null) };
        case QuizActions.SET_ANSWER:
            const a = { ...state.answers };
            a[action.index] = action.answer;
            return { ...state, answers: a };
        default:
            return state;
    }
}
