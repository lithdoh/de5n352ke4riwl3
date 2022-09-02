import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MathomeComponent } from './mathome.component';

describe('MathomeComponent', () => {
  let component: MathomeComponent;
  let fixture: ComponentFixture<MathomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MathomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MathomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
