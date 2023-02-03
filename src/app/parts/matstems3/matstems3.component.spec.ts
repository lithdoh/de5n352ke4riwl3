import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Matstems3Component } from './matstems3.component';

describe('Matstems3Component', () => {
  let component: Matstems3Component;
  let fixture: ComponentFixture<Matstems3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Matstems3Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Matstems3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
