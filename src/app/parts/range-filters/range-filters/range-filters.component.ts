import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-range-filters',
  templateUrl: './range-filters.component.html',
  styleUrls: ['./range-filters.component.css']
})
export class RangeFiltersComponent {

  nnfb = new FormBuilder().nonNullable;

  form = this.nnfb.group({
    priceRange: this.nnfb.group({
      min: this.nnfb.control(''),
      max: this.nnfb.control('')
    }),
  
    weightRange: this.nnfb.group({
      min: this.nnfb.control(''),
      max: this.nnfb.control('')
    })
  })
} 
