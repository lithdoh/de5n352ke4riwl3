import { Component, inject, Input, AfterViewInit, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import FormSection from 'src/app/models/form-section';
import { Stems } from 'src/app/models/stems.model';
import { ApiService } from './checkbox-services/api.service';
import { DataService } from './checkbox-services/data.service';

export interface FilterCategories {
  [key: string]: {
    label: string,
    filters: (string | number | null)[]
  }
}

@Component({
  selector: 'app-stem-checkbox-filters',
  templateUrl: './stem-checkbox-filters.component.html',
  styleUrls: ['./stem-checkbox-filters.component.css']
})
export class StemCheckboxFiltersComponent implements OnInit {
  categories: FilterCategories = {
    brand: {
      label: "Brand",
      filters: []
    },
    steererDiameter: {
      label: "Steerer Diameter",
      filters: []
    },
    rise: {
      label: "Rise (°)",
      filters: []
    },
    material: {
      label: "Material",
      filters: []
    },
    length: {
      label: "Length (mm)",
      filters: []
    },
    color: {
      label: "Color",
      filters: []
    },
    clampDiameter: {
      label: "Clamp Diameter (mm)",
      filters: []
    }
  };

  api = inject(ApiService);

  #dataService = inject(DataService);

  stems!: Stems[];

  @Input() set data(data: Stems[]) {
    this.stems = data;
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
    steererDiameter: this.nnfb.control([]),
    rise: this.nnfb.control([]),
    material: this.nnfb.control([]),
    length: this.nnfb.control([]),
    color: this.nnfb.control([]),
    clampDiameter: this.nnfb.control([]),
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
    this.api.stems$.subscribe((x) => this.data = x);
  }
}
