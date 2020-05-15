# Quizz Project

This is a multichoice questions and answers. You can create quizzes and distribute it to the people via a code, the person has to enter.

[mocked demo is https://appencoder3264.github.io/angular-quiz](https://appencoder3264.github.io/angular-quiz).
Default admin account is `admin/admin`.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9, material design and redux (ngrx).

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Stage
spring boot api on `http://localhost:8080`
ng serve --configuration=stage

## Prod
ng build --prod

# Demo
`ng build --prod ----output-path docs --base-href "/angular-quiz/"`

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

For example to create a new component 'documents' type: 
ng g component components/documents --module app

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
