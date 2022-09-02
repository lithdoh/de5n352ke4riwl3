import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StemsComponent } from './stems.component';

describe('StemsComponent', () => {
  let component: StemsComponent;
  let fixture: ComponentFixture<StemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
