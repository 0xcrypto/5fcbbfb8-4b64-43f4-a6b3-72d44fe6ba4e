import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticpageComponent } from './staticpage.component';

describe('StaticpageComponent', () => {
  let component: StaticpageComponent;
  let fixture: ComponentFixture<StaticpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaticpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaticpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
