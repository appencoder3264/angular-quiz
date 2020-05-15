# Quizz Project

This is multichoice questions and answers. You can create quizzes and distribute it to the people via a code, the person has to enter.

[mocked demo is https://appencoder3264.github.io/angular-quiz](https://appencoder3264.github.io/angular-quiz).
Default admin account is `admin/admin`.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9, material design and redux (ngrx).

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Java backend
The backend is build using spring data and uses HSQL and the defualt db. Authentication is build based on oAuth2 JWT tokens, so it could be integrated with other oauth2 prividers like Google, etc.

Go to `quiz-backend` and type `./gradelw build`

## Stage
Stage will be using the backand on `http://localhost:8080`
`java -jar  quiz-backend/build/libs/quiz-backend-0.0.1-SNAPSHOT.jar`
`ng serve --configuration=stage`

## Prod / Docker
1. ng build --prod
2. cd quiz-backend;
3. ./gradlew build
4. docker-compose up --build

if you dont wnat to use docker you can run it directly from the command line `java -jar  quiz-backend/build/libs/quiz-backend-0.0.1-SNAPSHOT.jar`

# GitHub Demo
`ng build --prod ----output-path docs --base-href "/angular-quiz/"`

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

For example to create a new component 'documents' type: 
ng g component components/documents --module app

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
