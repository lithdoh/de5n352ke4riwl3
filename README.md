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


Instead of sifting through compatibility guides and tables like these:
https://www.wtb.com/pages/tire-rim-fit-chart
https://www.ceramicspeed.com/media/3napv0hg/webposter_bbmatrix2021_web.pdf
https://productinfo.shimano.com/#/com

Users can simply enter the parts they currently have (or in the future, their build, and the parts from the build will be entered automatically) and see whether they are compatible or not. I also think it would be cool if the rule(s) that determines the compatibility of parts is made available. This would a great help in an educational sense, but it would also allow users to verify that the verdict is sensible. It will be difficult to get every last rule pinned down, so if people can verify rules and submit update suggestions, the community can be leveraged to make a really useful tool.

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
