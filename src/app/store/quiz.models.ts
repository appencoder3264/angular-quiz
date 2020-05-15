export interface ItemChoice {
    value: string;
  }
export interface QuestionItem {
    question: string;
    choices: ItemChoice[];
    answer: number;
  }

export interface QuizModel {
    name: string;
    questions: QuestionItem[];
    answers: number[];
    code: string;
}

export interface ExamDesc {
  id: number;
  name: string;
  changeDate: string;
  changedBy: string;
}

export interface CadidateItem {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  taken: string;
  code: string;
  result: number;
  assigmnetId: number;
}
