import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Matbars2Component } from './matbars2.component';

describe('Matbars2Component', () => {
  let component: Matbars2Component;
  let fixture: ComponentFixture<Matbars2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Matbars2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Matbars2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
