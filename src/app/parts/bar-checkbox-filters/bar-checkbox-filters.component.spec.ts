import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarCheckboxFiltersComponent } from './bar-checkbox-filters.component';

describe('BarCheckboxFiltersComponent', () => {
  let component: BarCheckboxFiltersComponent;
  let fixture: ComponentFixture<BarCheckboxFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarCheckboxFiltersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarCheckboxFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
