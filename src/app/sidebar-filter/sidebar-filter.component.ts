import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-sidebar-filter',
  templateUrl: './sidebar-filter.component.html',
  styleUrls: ['./sidebar-filter.component.css']
})
export class SidebarFilterComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }
  profileForm = this.fb.group({
    Renthal: false,
    Truvativ: false,
    'Industry Nine': false,
    Campy: false,
    Zipp: false,
    Spank: false,
  });
  brandArray: string[] = Object.keys(this.profileForm.value).sort();

  someComplete(): boolean {
    return Object.values(this.profileForm.value).every((x) => x === false);
  }

  uncheckAll() {
    this.profileForm.setValue({
      Renthal: false,
      Truvativ: false,
      'Industry Nine': false,
      Campy: false,
      Zipp: false,
      Spank: false,
    });
    // this.profileForm.reset() doesn't work because it sets all the values to null
  }

  removeSelection(selection: string) {
    this.profileForm.get(selection)?.setValue(false);
  }

}
