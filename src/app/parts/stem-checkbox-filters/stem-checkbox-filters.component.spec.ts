import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StemCheckboxFiltersComponent } from './stem-checkbox-filters.component';

describe('StemCheckboxFiltersComponent', () => {
  let component: StemCheckboxFiltersComponent;
  let fixture: ComponentFixture<StemCheckboxFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StemCheckboxFiltersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StemCheckboxFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
