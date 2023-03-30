import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import FormSection from 'src/app/models/form-section';
import { Stems } from 'src/app/models/stems.model';
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
export class StemCheckboxFiltersComponent {
  categories: FilterCategories = {
    brand: {
      label: "Brand",
      filters: []
    },
    steererDiameter: {
      label: "Steerer Diameter (mm)",
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

  #dataService = inject(DataService);

  #sections: string[] = ["steererDiameter", "rise", "material", "length", "color", "clampDiameter", "brand"];

  stems!: Stems[];

  @Input() set data(data: Stems[]) {
    this.stems = data;
    const sections = this.#sections.map<FormSection>((s) => ({
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
    clampDiameter: this.nnfb.control([])
  });

  addCheckboxNameToFormControl(section: string, name: string | number | null): void {
    const formSection = this.form.get(section) as FormControl;
    const index = formSection.value.indexOf(name);

    console.log('categories: ', this.categories);

    // Alternate way, something like:
    // if(this.brands.value.includes(name)) {
    //   this.brands.setValue(this.brands.value.splice(this.brands.value.indexOf(name, 1)));
    // } else {
    //   this.brands.setValue(this.brands.value.push(name));
    // }

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
    // If (some, but not all) OR none of the checkboxes are checked when All is clicked, set the value to all.
    if ((
      (formSection.value.length > 0) &&
      (formSection.value.length < this.categories[section].filters.length)) ||
      (formSection.value.length === 0)) {
      formSection.setValue(this.categories[section].filters);
    } else {
      formSection.setValue([]);
    }
  }

  brandsValueContains(section: string, checkboxName: string | number | null): boolean {
    const formSection = this.form.get(section) as FormControl;
    return formSection.value.includes(checkboxName);
  }

  logger() {
    // console.log('posts: ', this.posts);
  }

  log(x: any) {
    console.log('x: ', x);
  }

  ngAfterViewInit() {
    this.form.controls.brand.valueChanges.subscribe(x => console.log('xpp: ', x));
  }
}
