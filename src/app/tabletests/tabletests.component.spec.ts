import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabletestsComponent } from './tabletests.component';

describe('TabletestsComponent', () => {
  let component: TabletestsComponent;
  let fixture: ComponentFixture<TabletestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabletestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabletestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
