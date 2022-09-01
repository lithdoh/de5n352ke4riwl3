import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MATbarsComponent } from './matbars.component';

describe('MATbarsComponent', () => {
  let component: MATbarsComponent;
  let fixture: ComponentFixture<MATbarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MATbarsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MATbarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
