import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GqlmatstemsComponent } from './gqlmatstems.component';

describe('GqlmatstemsComponent', () => {
  let component: GqlmatstemsComponent;
  let fixture: ComponentFixture<GqlmatstemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GqlmatstemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GqlmatstemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
