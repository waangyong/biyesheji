import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetFillPage } from './sheet-fill.page';

describe('SheetFillPage', () => {
  let component: SheetFillPage;
  let fixture: ComponentFixture<SheetFillPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SheetFillPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetFillPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
