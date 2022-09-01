import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatstemsComponent } from './matstems.component';

describe('MatstemsComponent', () => {
  let component: MatstemsComponent;
  let fixture: ComponentFixture<MatstemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatstemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatstemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
