import { Component, inject, Input, AfterViewInit, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import FormSection from 'src/app/models/form-section';
import { ApiService } from '../stem-checkbox-filters/checkbox-services/api.service';
import { DataService } from '../stem-checkbox-filters/checkbox-services/data.service';
import { Bars } from 'src/app/models/bars.model';

export interface FilterCategories {
  [key: string]: {
    label: string,
    filters: (string | number | null)[]
  }
}

@Component({
  selector: 'app-bar-checkbox-filters',
  templateUrl: './bar-checkbox-filters.component.html',
  styleUrls: ['./bar-checkbox-filters.component.css']
})
export class BarCheckboxFiltersComponent {

  // The purpose of this function is to override the keyvalue pipes default sorting with not sorting.
  // The data stays in the format is began with.
  compareFn() {
    return 0;
  };

  categories: FilterCategories = {
    brand: {
      label: "Brand",
      filters: []
    },
    diameter: {
      label: "Diameter (mm)",
      filters: []
    },
    rise: {
      label: "Rise (°)",
      filters: []
    },
    upsweep: {
      label: "Upsweep (°)",
      filters: []
    },
    backsweep: {
      label: "Backsweep (°)",
      filters: []
    },
    width: {
      label: "Width (mm)",
      filters: []
    },
    color: {
      label: "Color",
      filters: []
    },
    material: {
      label: "Material",
      filters: []
    }
  };

  api = inject(ApiService);

  #dataService = inject(DataService);

  bars!: Bars[];

  @Input() set data(data: Bars[]) {
    this.bars = data;
    const categoryKeys = Object.keys(this.categories);
    const sections = categoryKeys.map<FormSection>((s) => ({
      name: s,
      checkboxNames: this.#dataService.getUniqueValues(data, s),
    }));
    sections.forEach(({ name, checkboxNames }) => {
      this.categories[name].filters = checkboxNames;
    })
  }

  nnfb = new FormBuilder().nonNullable;

  form = this.nnfb.group({
    brand: this.nnfb.control([]),
    diameter: this.nnfb.control([]),
    rise: this.nnfb.control([]),
    upsweep: this.nnfb.control([]),
    backsweep: this.nnfb.control([]),
    width: this.nnfb.control([]),
    color: this.nnfb.control([]),
    material: this.nnfb.control([]),
  });

  addCheckboxNameToFormControl(section: string, name: string | number | null): void {
    const formSection = this.form.get(section) as FormControl;
    const index = formSection.value.indexOf(name);

    if (index > -1) {
      formSection.setValue([
        ...formSection.value.slice(0, index),
        ...formSection.value.slice(index + 1),
      ]);
    } else {
      formSection.setValue([...formSection.value, name]);
    }
  };

  allChecked(section: string): boolean {
    const formSection = this.form.get(section) as FormControl;
    return formSection.value.length === this.categories[section].filters.length;
  }

  someChecked(section: string): boolean {
    const formSection = this.form.get(section) as FormControl;
    return (formSection.value.length > 0) && (formSection.value.length < this.categories[section].filters.length)
  }

  setAll(section: string) {
    const formSection = this.form.get(section) as FormControl;
    if (formSection.value.length !== this.categories[section].filters.length) {
      formSection.setValue(this.categories[section].filters);
    } else {
      formSection.setValue([]);
    }
  }

  checkIfSectionContainsCheckbox(section: string, checkboxName: string | number | null): boolean {
    const formSection = this.form.get(section) as FormControl;
    return formSection.value.includes(checkboxName);
  }

  // logger() {
  //   // console.log('posts: ', this.posts);
  // }

  // log(x: any) {
  //   console.log('x: ', x);
  // }

  ngOnInit() {
    this.api.bars$.subscribe((x) => this.data = x);
  }
}
