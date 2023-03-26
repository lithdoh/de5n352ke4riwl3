**Don't worry about the repo name 🤔**

Cycle Selector is a website I'm working on to help people determine bike part compatibility.
It makes use of reactive principals on things like the sort headers, paginator, filters, search input, receiving data from backend, etc.

Features server-side sorting, filtering and pagination:

![BikePartPicker Sorting:Filtering](https://user-images.githubusercontent.com/100744679/227733989-859f9d42-794d-49dd-b386-73bb7a220ccf.jpg)

Pagination:

![BikePartPicker-pagination](https://user-images.githubusercontent.com/100744679/227734069-9477ffaa-b7dc-4b22-8571-3367a1f49eea.jpg)

(I'm proud of the fact that the paginator's total count updates when filters are set.)

Build page with localStorage:

![BikePartPicker mathome](https://user-images.githubusercontent.com/100744679/227734154-ec4e505f-2e15-4e08-a697-99beaa1fd271.jpg)

The build page above will have the rest of the parts that go on a bike, but I'm getting the Stem page where I want it first as the rest of the pages are very similar.

Uses Dgraph database to model the compatibility relationships between part types, e.g. [frame, fork], [chain, cassette], [rear derailleur, crankset].

![BikePartPicker-dgraph-ratel](https://user-images.githubusercontent.com/100744679/227734527-11ad8a46-7a0d-42e5-b27a-c1977f9bbf6d.jpg)

**Basic Idea:**

  Instead of sifting through compatibility guides and tables like these:

  https://www.wtb.com/pages/tire-rim-fit-chart,

  https://www.ceramicspeed.com/media/3napv0hg/webposter_bbmatrix2021_web.pdf,

  https://productinfo.shimano.com/#/com,

  users can select parts and see whether they are compatible or not. I think it would be cool if the rule(s) that determines the compatibility of parts is/are made available. This would a great help in an educational sense, but it would also allow users to verify that the verdict is sensible. Because it will be difficult to get every last rule pinned down, I think it would be good to have a way for people to verify rules and submit update suggestions as compatibility is not always straightforward. For example, if you have a chain and rear derailleur that are the same speed, they still might not be compatible because it's a flattop chain and the rear derailleur is SRAM Eagle and hence is not compatible because of the rear derailleur pulley. So if you inspect the rule for chains --> rear derailleurs, you would see that it's just "chain speed must equal rear derailleur speed," and that it's not any more discerning than that. You can now update your decision based on this and you can submit a rule update request for this exception.


**Compatible But Not Recommended:**

Two parts might be technically compatible, but there may be drawbacks to using them. If you use a Shimano cassette and a SRAM chain, your shifting might be suboptimal compared to using the same brands for both parts. Similarly, you _can_ use a 2.8" tire on a 28mm rim, but the tire shape becomes too tall and round, which can result in reduced cornering performance and tire squirm. It would be good to have warnings for things like this.


**Database of Completes, Not Just Parts:**

I'd like to keep a database of completed builds that companies have sold, for three reasons:
1. Users can enter their Brand, Model, and Year instead of manually entering their bike’s components.
2. If a user builds a bike that is already being sold as a complete, show them the complete because it will probably be cheaper than the sum of the part costs.
3. Knowing that a combination of parts has been used by a brand in a complete bike boosts confidence that these parts are compatible. (Cycle Selector won't be absolutely perfect)

**What I'm Working On Now:**

Currently I'm trying to come up with a good way to do the filter checkboxes. It's kind of tricky because they should:

- come from the backend (too many to add manually)
- have a count of how many products would be left if the user were to click that checkbox (count also comes from backend)
- be sorted alphabetically for string-based filters and ascending for number-based filters so that users can find the filter they want quickly
- be part of one reactive form group so that the paginator can be reset in one go (would have to reset paginator individually for each section otherwise)
- be Angular Material checkboxes, to keep with the theme.

Also:

- each section should have a "--" checkbox in case you want to filter by parts that have null for the property you're filtering by
- each checkbox must be controllable by the "Select All/None" checkbox
- whatever I use to create the filters for "Stems" also has to work for every other type of bike part, because they'll each have their own page

Speaking of those pages, I need a way to make a generic one. Each type of part will have a data table with sorting, pagination and filtering, but they differ in column names, filter sections, and of course the actual data. I'm looking into ngTemplateOutlet for this.

**Future Plans:**

URL Parameters -- When you select filters, adjust the URL parameters so that you can share the link to that product page with the filters already set.

Filter Color Coding -- When filters are set as a result of your part selection and not because you checked filter checkboxes, they will appear in a different color and will be disabled; to remove them you have to remove the relevant selection. One color for each type of part that affects filters, and the default color for manually set checkboxes.

Tools List -- Tells you which tools are required for installation of new parts or removal of old parts.

Dependency Graph -- A visualization of which parts depend on which other parts.


How to run:

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
