import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Matstems5Component } from './matstems5.component';

describe('Matstems5Component', () => {
  let component: Matstems5Component;
  let fixture: ComponentFixture<Matstems5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Matstems5Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Matstems5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
