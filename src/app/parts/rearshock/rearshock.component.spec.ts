import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RearshockComponent } from './rearshock.component';

describe('RearshockComponent', () => {
  let component: RearshockComponent;
  let fixture: ComponentFixture<RearshockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RearshockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RearshockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
