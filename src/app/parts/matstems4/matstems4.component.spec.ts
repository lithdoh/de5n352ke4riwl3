import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Matstems4Component } from './matstems4.component';

describe('Matstems4Component', () => {
  let component: Matstems4Component;
  let fixture: ComponentFixture<Matstems4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Matstems4Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Matstems4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
