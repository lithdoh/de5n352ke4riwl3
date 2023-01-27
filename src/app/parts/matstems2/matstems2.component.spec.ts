import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Matstems2Component } from './matstems2.component';

describe('Matstems2Component', () => {
  let component: Matstems2Component;
  let fixture: ComponentFixture<Matstems2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Matstems2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Matstems2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
