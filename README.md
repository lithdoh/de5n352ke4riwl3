**Don't worry about the repo name**

Cycle Selector is a website I'm working on to help people determine bike part compatibility.
It makes use of reactive principals on things like the sort headers, paginator, filters, search input, receiving data from backend, etc.

Features server-side sorting and filtering:

![BikePartPicker Sorting:Filtering](https://user-images.githubusercontent.com/100744679/227733989-859f9d42-794d-49dd-b386-73bb7a220ccf.jpg)

Server-side pagination:

![BikePartPicker-pagination](https://user-images.githubusercontent.com/100744679/227734069-9477ffaa-b7dc-4b22-8571-3367a1f49eea.jpg)

Build selections page with localStorage:

![BikePartPicker mathome](https://user-images.githubusercontent.com/100744679/227734154-ec4e505f-2e15-4e08-a697-99beaa1fd271.jpg)

Uses Dgraph database to model the compatibility relationships between part types, e.g. [frame, fork], [chain, cassette], [rear derailleur, crankset].

![BikePartPicker-dgraph-ratel](https://user-images.githubusercontent.com/100744679/227734527-11ad8a46-7a0d-42e5-b27a-c1977f9bbf6d.jpg)



# de5n352ke4riwl3

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.1.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
