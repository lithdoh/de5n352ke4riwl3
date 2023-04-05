import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeFiltersComponent } from './range-filters.component';

describe('RangeFiltersComponent', () => {
  let component: RangeFiltersComponent;
  let fixture: ComponentFixture<RangeFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RangeFiltersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RangeFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
