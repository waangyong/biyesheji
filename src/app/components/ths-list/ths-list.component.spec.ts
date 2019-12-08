import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThsListComponent } from './ths-list.component';

describe('ThsListComponent', () => {
  let component: ThsListComponent;
  let fixture: ComponentFixture<ThsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThsListComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
